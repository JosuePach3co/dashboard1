import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import type { OpenMeteoResponse } from '../types/DashboardTypes';

interface TableUIProps {
   data?: OpenMeteoResponse;
   loading?: boolean;
   error?: string | null;
}

export default function TableUI({ data, loading = false, error = null }: TableUIProps) {
   const rows = (data?.hourly?.time ?? []).slice(0, 12).map((time, index) => ({
      id: index,
      time,
      temperature: data?.hourly.temperature_2m[index] ?? null,
      windSpeed: data?.hourly.wind_speed_10m[index] ?? null,
   }));

   const columns: GridColDef[] = [
      { field: 'time', headerName: 'Hora', width: 200 },
      {
         field: 'temperature',
         headerName: `Temperatura (${data?.hourly_units.temperature_2m ?? ''})`,
         width: 170,
      },
      {
         field: 'windSpeed',
         headerName: `Viento (${data?.hourly_units.wind_speed_10m ?? ''})`,
         width: 170,
      },
   ];

   if (loading) {
      return (
         <Box sx={{ height: 350, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

   if (!rows.length) {
      return (
         <Typography sx={{ py: 4 }}>
            No hay datos disponibles para mostrar.
         </Typography>
      );
   }

   return (
      <Box sx={{ height: 350, width: '100%' }}>
         <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
               pagination: {
                  paginationModel: {
                     pageSize: 5,
                  },
               },
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
         />
      </Box>
   );
}