using System.Text.Json.Serialization;

namespace Payment.API.DTOs
{
    public class DailyRevenueDto
    {
        [JsonPropertyName("date")]
        public string Date { get; set; } = string.Empty;
        
        [JsonPropertyName("revenue")]
        public decimal Revenue { get; set; }
    }
}
