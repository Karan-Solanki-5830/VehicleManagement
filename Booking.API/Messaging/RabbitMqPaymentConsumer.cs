using System.Text;
using System.Text.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace Booking.API.Messaging
{
    public class PaymentCreatedEvent
    {
        public int Id { get; set; }
        public int BookingId { get; set; }
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; }
    }

    public class RabbitMqPaymentConsumer : BackgroundService
    {
        private readonly string _host;

        public RabbitMqPaymentConsumer()
        {
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

            channel.ExchangeDeclare("payment.exchange", ExchangeType.Fanout, durable: true);

            var queueName = channel.QueueDeclare().QueueName;

            channel.QueueBind(queueName, "payment.exchange", "");

            var consumer = new AsyncEventingBasicConsumer(channel);
            consumer.Received += (model, ea) =>
            {
                var body = ea.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);

                Console.WriteLine($"[RabbitMQ-PaymentConsumer] Received: {message}");

                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var paymentEvent = JsonSerializer.Deserialize<PaymentCreatedEvent>(message, options);

                if (paymentEvent != null && paymentEvent.BookingId > 0)
                {
                    Console.WriteLine($"[RabbitMQ-PaymentConsumer] Payment Recieved for Booking {paymentEvent.BookingId}: Amount {paymentEvent.Amount}");

                }
                return Task.CompletedTask;
            };

            channel.BasicConsume(queueName, true, consumer);

            try
            {
                while (!stoppingToken.IsCancellationRequested) await Task.Delay(1000, stoppingToken);
            }
            catch (OperationCanceledException)
            {
            }
        }
    }
}
