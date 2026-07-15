import { useEffect, useState } from 'react';
import { type OpenMeteoResponse } from '../types/DashboardTypes';

const URL = 'https://api.open-meteo.com/v1/forecast?latitude=-2.1962&longitude=-79.8862&hourly=temperature_2m,wind_speed_10m&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&timezone=auto';

export interface UseFetchDataResult {
    data?: OpenMeteoResponse;
    loading: boolean;
    error: string | null;
}

export default function useFetchData(): UseFetchDataResult {
    const [data, setData] = useState<OpenMeteoResponse>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const getData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(URL);

                if (!response.ok) {
                    throw new Error('Error al obtener los datos del clima');
                }

                const jsonData: OpenMeteoResponse = await response.json();

                if (isMounted) {
                    setData(jsonData);
                }
            } catch (caughtError) {
                if (!isMounted) {
                    return;
                }

                console.error('Error fetching data:', caughtError);
                setData(undefined);
                setError(caughtError instanceof Error ? caughtError.message : 'Error inesperado al obtener los datos del clima');
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        void getData();

        return () => {
            isMounted = false;
        };
    }, []);

    return { data, loading, error };
}