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
  match_week: number;
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
        setError('Failed to fetch predictions');
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [token, leagueId]);

  const groupedPredictions = predictions.reduce((acc: any, prediction) => {
    const week = prediction.fixture.match_week;
    const league = prediction.fixture.league.name;
    if (!acc[week]) {
      acc[week] = {};
    }
    if (!acc[week][league]) {
      acc[week][league] = [];
    }
    acc[week][league].push(prediction);
    return acc;
  }, {});

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto w-full sm:w-3/4 md:w-2/3 lg:w-1/2 p-4">
      {Object.keys(groupedPredictions).length === 0 ? (
        <div className="text-center text-gray-500">No predictions available</div>
      ) : (
        Object.keys(groupedPredictions).map(week => (
          <div key={week}>
            <h2 className="text-xl font-bold mb-4">Match Week {week}</h2>
            {Object.keys(groupedPredictions[week]).map(league => (
              <div key={league} className="mb-6">
                <h3 className="text-lg font-semibold mb-2">{league}</h3>
                {groupedPredictions[week][league].map((prediction: Prediction) => (
                  <div key={prediction.id} className="mb-4 p-4 border rounded-lg shadow-md bg-white">
                    <div className="items-center text-gray-700 mb-2">
                      <div className="justify-between">
                        <div className="text-xl font-medium">
                          {prediction.fixture.home_team} {prediction.fixture.home_team_ft_score !== null ? prediction.fixture.home_team_ft_score : 'N/A'} - {prediction.fixture.away_team_ft_score !== null ? prediction.fixture.away_team_ft_score : 'N/A'} {prediction.fixture.away_team}
                        </div>
                        <div className="text-xl">
                        {prediction.home_prediction_score} - {prediction.away_prediction_score}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default PredictionList;
