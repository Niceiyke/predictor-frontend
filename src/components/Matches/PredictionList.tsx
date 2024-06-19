import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

interface User {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
}

interface League {
  name: string;
  id: number;
  premium: boolean;
}

interface Fixture {
  id: number;
  home_team: string;
  away_team: string;
  match_date: string;
  league: League;
  home_team_ft_score: number | null;
  away_team_ft_score: number | null;
}

interface Prediction {
  id: number;
  user: User;
  fixture: Fixture;
  home_prediction_score: number;
  away_prediction_score: number;
}

const PredictionList: React.FC = () => {
  const { token } = useAuth(); 
  const { leagueId } = useParams<{ leagueId: string }>();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      const user_id = (jwtDecode(token) as { id: number }).id;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/predictions/user?user_id=${user_id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch matches');
        }
        const data: Prediction[] = await response.json();
        setPredictions(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching matches:', error);

      }
    };

    fetchPredictions();
  }, [token, leagueId]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto w-2/4 p-4">
      {predictions.length === 0 ? (
        <div className="text-center text-gray-500">No predictions available</div>
      ) : (
        predictions.map(prediction => (
          <div key={prediction.id} className="mb-4 p-4 border rounded-lg shadow-md bg-white">
            <div className="font-bold text-lg mb-2">
              {prediction.fixture.home_team} vs {prediction.fixture.away_team}
            </div>
            <div className="text-gray-700">
              <div className="mb-1"><span className="font-medium">Match Date:</span> {new Date(prediction.fixture.match_date).toLocaleString()}</div>
              <div className="mb-1"><span className="font-medium">League:</span> {prediction.fixture.league.name}</div>
              <div className="mb-1"><span className="font-medium">Full Time Score:</span> {prediction.fixture.home_team_ft_score} - {prediction.fixture.away_team_ft_score}</div>
              <div className="mb-1"><span className="font-medium">Prediction:</span> {prediction.home_prediction_score} - {prediction.away_prediction_score}</div>
              <div className="mb-1"><span className="font-medium">User:</span> {prediction.user.username}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PredictionList;
