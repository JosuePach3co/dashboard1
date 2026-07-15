import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { LineChart } from '@mui/x-charts/LineChart';
import type { OpenMeteoResponse } from '../types/DashboardTypes';

interface ChartUIProps {
   data?: OpenMeteoResponse;
   loading?: boolean;
   error?: string | null;
}

export default function ChartUI({ data, loading = false, error = null }: ChartUIProps) {
   const labels = (data?.hourly?.time ?? []).slice(0, 24);
   const temperatureValues = (data?.hourly?.temperature_2m ?? []).slice(0, 24);
   const windValues = (data?.hourly?.wind_speed_10m ?? []).slice(0, 24);

   if (loading) {
      return (
         <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress />
         </Box>
      );
   }

   if (error) {
      return (
         <Typography color="error" sx={{ py: 4 }}>
            {error}
         </Typography>
      );
   }

   if (!labels.length) {
      return (
         <Typography sx={{ py: 4 }}>
            No hay datos disponibles para el gráfico.
         </Typography>
      );
   }

   return (
      <>
         <Typography variant="h5" component="div">
            Temperatura y viento por hora
         </Typography>
         <LineChart
            height={300}
            series={[
               { data: temperatureValues, label: `Temperatura (${data?.hourly_units.temperature_2m ?? ''})` },
               { data: windValues, label: `Viento (${data?.hourly_units.wind_speed_10m ?? ''})` },
            ]}
            xAxis={[{ scaleType: 'point', data: labels }]}
         />
      </>
   );
}