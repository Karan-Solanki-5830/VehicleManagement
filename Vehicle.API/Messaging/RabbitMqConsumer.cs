using System.Text;
using System.Text.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using Vehicle.API.Services.Interfaces;

namespace Vehicle.API.Messaging
{
    public class BookingCreatedEvent
    {
        public int BookingId { get; set; }
        public int VehicleId { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class RabbitMqVehicleConsumer : BackgroundService
    {
        private readonly string _host;
        private readonly IServiceScopeFactory _scopeFactory;

        public RabbitMqVehicleConsumer(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
            _host = Environment.GetEnvironmentVariable("RabbitMQHost") ?? "localhost";
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var factory = new ConnectionFactory
            {
                HostName = _host,
                DispatchConsumersAsync = true
            };

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

            channel.ExchangeDeclare(
                exchange: "booking.exchange",
                type: ExchangeType.Fanout,
                durable: true
            );

            var queueName = channel.QueueDeclare().QueueName;

            channel.QueueBind(
                queue: queueName,
                exchange: "booking.exchange",
                routingKey: ""
            );

            var consumer = new AsyncEventingBasicConsumer(channel);

            consumer.Received += async (model, ea) =>
            {
                var body = ea.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);

                Console.WriteLine($"[RabbitMQ-Vehicle] Received: {message}");

                if (message.Contains("CreatedAt"))
                {
                    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                    var bookingEvent = JsonSerializer.Deserialize<BookingCreatedEvent>(message, options);

                    if (bookingEvent != null)
                    {
                        Console.WriteLine($"[RabbitMQ-Vehicle] Checking availability for Vehicle {bookingEvent.VehicleId}...");
                        bool isSuccess = await UpdateVehicleAvailability(bookingEvent.VehicleId);
                        Console.WriteLine($"[RabbitMQ-Vehicle] Availability result: {isSuccess}");

                        var response = new
                        {
                            BookingId = bookingEvent.BookingId,
                            Status = isSuccess ? "Confirmed" : "Failed"
                        };

                        var responseBody = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(response));

                        channel.BasicPublish(
                            exchange: "booking.exchange",
                            routingKey: "",
                            basicProperties: null,
                            body: responseBody
                        );

                        Console.WriteLine($"[RabbitMQ-Vehicle] Processed Booking {bookingEvent.BookingId}. Response sent.");
                    }
                }
            };

            channel.BasicConsume(queue: queueName, autoAck: true, consumer: consumer);

            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(1000, stoppingToken);
            }
        }

        private async Task<bool> UpdateVehicleAvailability(int vehicleId)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var vehicleService = scope.ServiceProvider.GetRequiredService<IVehicleService>();

                var vehicle = await vehicleService.GetVehicleByIdAsync(vehicleId);
                
                if (vehicle != null && vehicle.Status == "Available")
                {
                    // For date-based availability, we don't mark the vehicle as unavailable globally.
                    // We just confirm it exists and is operational.
                    Console.WriteLine($"[RabbitMQ-Vehicle] Vehicle {vehicleId} is operational (Available).");
                    return true;
                }
                else
                {
                    Console.WriteLine($"[RabbitMQ-Vehicle] Vehicle {vehicleId} not found or not operational (Status: {vehicle?.Status}).");
                    return false;
                }
            }
        }
    }
}
