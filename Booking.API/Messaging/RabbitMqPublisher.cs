using System.Text;
using System.Text.Json;
using RabbitMQ.Client;

//http://localhost:15672 //

namespace Booking.API.Messaging
{
    public class RabbitMqPublisher
    {
        private readonly string _host;

        public RabbitMqPublisher()
        {
            _host = Environment.GetEnvironmentVariable("RabbitMQHost") ?? "localhost";
        }

        public void PublishBookingCreated(BookingCreatedEvent evt)
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
                    exchange: "booking.exchange",
                    type: ExchangeType.Fanout,
                    durable: true
                );

                var body = Encoding.UTF8.GetBytes(
                    JsonSerializer.Serialize(evt)
                );

                channel.BasicPublish(
                    exchange: "booking.exchange",
                    routingKey: "",
                    basicProperties: null,
                    body: body
                );

                Console.WriteLine($"[RabbitMQ] Sent message to booking.exchange: {JsonSerializer.Serialize(evt)}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[RabbitMQ Error] Failed to publish message. {ex.Message}");
            }
        }
    }
}
