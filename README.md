# VehicleManagement

A microservices-based vehicle booking and management system built with .NET (C#) and Angular/TypeScript. Each service handles a specific domain and they communicate through an API Gateway using Ocelot.

## Services

- **ApiGateway** — single entry point, routes requests to the right service
- **Customer.API** — handles customer registration and profiles  
- **Vehicle.API** — manages vehicle listings and availability  
- **Booking.API** — creates and tracks bookings  
- **Payment.API** — processes payments tied to bookings  
- **Frontend** — TypeScript/Angular UI that talks to the gateway

## Tech Stack

- ASP.NET Core (.NET 8)
- Angular + TypeScript
- MS SQL Server (`mssql`)
- Ocelot API Gateway
- Visual Studio 2022

## Getting Started

1. Clone the repo
```bash
   git clone https://github.com/Karan-Solanki-5830/VehicleManagement.git
```

2. Add your `appsettings.json` to each API project (not committed — see `.gitignore`). At minimum each one needs:
```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "your-sql-connection-string"
     },
     "Jwt": {
       "Key": "your-secret-key"
     }
   }
```

3. Open `VehicleManagement.sln` in Visual Studio and set multiple startup projects (all APIs + ApiGateway).

4. For the frontend:
```bash
   cd Frontend
   npm install
   ng serve
```

## Notes

- `appsettings.json` and all secret files are gitignored — never commit them
- The `AdminPass_DO NOT SHARE.txt` file stays local only
- SQL Server must be running before starting the APIs
