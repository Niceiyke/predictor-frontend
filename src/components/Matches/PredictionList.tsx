import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { axiosInstance } from '../../../config/https';

interface User {
  id: number;
  username: string;
  email: string;
  is_admin: boolean | null;
  point: number;
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
  result: string;
  status: string;
}



interface Prediction {
  id: number;
  user: User;
  fixture: Fixture;
  home_prediction_score: string;
  away_prediction_score: string;
  result: string;
  correct_score: string;
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
        const response = await axiosInstance.get(`/predictions/user?user_id=${user_id}`);
        if (response.status !== 200) {
          throw new Error('Failed to fetch matches');
        }
        const data: Prediction[] = await response.data;
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

  const getResultClass = (prediction: Prediction) => {
    if (prediction.fixture.home_team_ft_score === null || prediction.fixture.away_team_ft_score === null) {
      return '';
    }
    return prediction.result === prediction.fixture.result ? 'bg-green-100' : 'bg-red-100';
  };

  const getCorrectScoreClass = (prediction: Prediction) => {
    if (prediction.fixture.home_team_ft_score === null || prediction.fixture.away_team_ft_score === null) {
      return '';
    }
    return prediction.correct_score === 'correct' ? 'bg-green-100' : 'bg-red-100';
  };

  const calculatePoints = (prediction: Prediction) => {
    let points = 1000; // Points for creating a prediction
    if (prediction.fixture.home_team_ft_score !== null && prediction.fixture.away_team_ft_score !== null) {
      if (prediction.result === prediction.fixture.result) {
        points += 5000; // Points for correct result
      }
      if (prediction.correct_score === 'correct') {
        points += 20000; // Points for correct score
      }
    }
    return points;
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const sortedWeeks = Object.keys(groupedPredictions).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <div className="container mx-auto w-full sm:w-3/4 md:w-2/3 lg:w-1/2 p-4">
      {sortedWeeks.length === 0 ? (
        <div className="text-center text-gray-500">No predictions available</div>
      ) : (
        sortedWeeks.map(week => (
          <div key={week}>
            <h2 className="text-xl font-bold mb-4">Match Week {week}</h2>
            {Object.keys(groupedPredictions[week]).map(league => (
              <div key={league} className="mb-6">
                <h3 className="font-semibold mb-2 text-gray-500">{league}</h3>
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2">Teams</th>
                      <th className="py-2">FT Score</th>
                      <th className="py-2">Prediction</th>
                      <th className="py-2">Result</th>
                      <th className="py-2">Correct Score</th>
                      <th className="py-2">Points Earned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedPredictions[week][league].map((prediction: Prediction) => (
                      <tr key={prediction.id}>
                        <td className="border px-4 py-2">
                          {prediction.fixture.home_team} vs {prediction.fixture.away_team}
                        </td>
                        <td className="border px-4 py-2">
                          {prediction.fixture.home_team_ft_score !== null ? prediction.fixture.home_team_ft_score : '-'} - {prediction.fixture.away_team_ft_score !== null ? prediction.fixture.away_team_ft_score : '-'}
                        </td>
                        <td className="border px-4 py-2">
                          {prediction.home_prediction_score} - {prediction.away_prediction_score}
                        </td>
                        <td className={`border px-4 py-2 ${getResultClass(prediction)}`}>
                          {prediction.fixture.home_team_ft_score !== null && prediction.fixture.away_team_ft_score !== null
                            ? (prediction.result === prediction.fixture.result ? 'win' : 'lose')
                            : '-'}
                        </td>
                        <td className={`border px-4 py-2 ${getCorrectScoreClass(prediction)}`}>
                          {prediction.fixture.home_team_ft_score !== null && prediction.fixture.away_team_ft_score !== null
                            ? (prediction.correct_score === 'correct' ? 'win' : 'lose')
                            : '-'}
                        </td>
                        <td className="border px-4 py-2">
                          {calculatePoints(prediction)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default PredictionList;
