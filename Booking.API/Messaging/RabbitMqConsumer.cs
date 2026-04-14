using System.Text;
using System.Text.Json;
using Booking.API.Services.Interfaces;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace Booking.API.Messaging
{
    public class BookingUpdateEvent
    {
        public int BookingId { get; set; }
        public string? Status { get; set; }
    }

    public class RabbitMqBookingConsumer : BackgroundService
    {
        private readonly string _host;
        private readonly IServiceScopeFactory _scopeFactory;

        public RabbitMqBookingConsumer(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
            _host = Environment.GetEnvironmentVariable("RabbitMQHost") ?? "localhost";
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var factory = new ConnectionFactory { HostName = _host, DispatchConsumersAsync = true };

            IConnection connection = null;
            IModel channel = null;

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    connection = factory.CreateConnection();
                    channel = connection.CreateModel();
                    break;
                }
                catch (Exception)
                {
                    await Task.Delay(3000, stoppingToken);
                }
            }

            if (connection == null || channel == null) return;

            channel.ExchangeDeclare("booking.exchange", ExchangeType.Fanout, durable: true);

            var queueName = channel.QueueDeclare().QueueName;


            channel.QueueBind(queueName, "booking.exchange", "");

            var consumer = new AsyncEventingBasicConsumer(channel);
            consumer.Received += async (model, ea) =>
            {
                var body = ea.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);

                Console.WriteLine($"[RabbitMQ-Booking] Received: {message}");

                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

                var updateEvent = JsonSerializer.Deserialize<BookingUpdateEvent>(message, options);

                if (updateEvent != null && updateEvent.BookingId > 0 && !string.IsNullOrEmpty(updateEvent.Status))
                {
                    Console.WriteLine($"[RabbitMQ-Booking] Deserialized Event for Booking {updateEvent.BookingId} with Status {updateEvent.Status}");
                    await UpdateBookingStatus(updateEvent);
                }
            };

            channel.BasicConsume(queueName, true, consumer);

            while (!stoppingToken.IsCancellationRequested) await Task.Delay(1000, stoppingToken);
        }

        private async Task UpdateBookingStatus(BookingUpdateEvent evt)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var bookingService = scope.ServiceProvider.GetRequiredService<IBookingService>();
                var booking = await bookingService.GetBookingByIdAsync(evt.BookingId);
                if (booking != null)
                {
                    booking.Status = evt.Status;
                    await bookingService.UpdateBookingAsync(booking);
                    Console.WriteLine($"[RabbitMQ-Booking] Updated Booking {evt.BookingId} status to {evt.Status}");
                }
            }
        }
    }
}
