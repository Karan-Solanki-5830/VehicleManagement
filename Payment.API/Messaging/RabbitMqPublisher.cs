using System.Text;
using System.Text.Json;
using RabbitMQ.Client;

namespace Payment.API.Messaging
{
    public class RabbitMqPublisher
    {
        private readonly string _host;

        public RabbitMqPublisher()
        {
            _host = Environment.GetEnvironmentVariable("RabbitMQHost") ?? "localhost";
        }

        public void PublishPaymentCreated(PaymentCreatedEvent evt)
        {
            try
            {
                var factory = new ConnectionFactory
                {
                    HostName = _host
                };

                using var connection = factory.CreateConnection();
                using var channel = connection.CreateModel();

                channel.ExchangeDeclare(
                    exchange: "payment.exchange",
                    type: ExchangeType.Fanout,
                    durable: true
                );

                var body = Encoding.UTF8.GetBytes(
                    JsonSerializer.Serialize(evt)
                );

                channel.BasicPublish(
                    exchange: "payment.exchange",
                    routingKey: "",
                    basicProperties: null,
                    body: body
                );

                Console.WriteLine($"[RabbitMQ-Payment] Sent message to payment.exchange: {JsonSerializer.Serialize(evt)}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[RabbitMQ Error] Failed to publish message. {ex.Message}");
            }
        }
    }
}
