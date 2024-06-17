import React, { useEffect, useState, ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { useAuth } from '../../context/AuthContext';

interface League {
  name: string;
  id: number;
  premium: boolean;
}

interface Match {
  id: number;
  home_team: string;
  away_team: string;
  match_date: string;
  league: League;
  home_team_ft_score: number | null;
  away_team_ft_score: number | null;
}

interface Prediction {
  fixture_id: number;
  home_prediction_score: number | null;
  away_prediction_score: number | null;
}

const MatchList: React.FC = () => {
  const { token } = useAuth(); 
  const { leagueId } = useParams<{ leagueId: string }>();
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Record<number, Prediction>>({});

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/fixtures/not-predicted/?league_id=${leagueId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(token)}`
          }
        });
        if (response.status === 404) {
          setMatches([]);
        }
        if (!response.ok) {
          throw new Error('Failed to fetch matches');
        }
        const data: Match[] = await response.json();
        setMatches(data);
      } catch (error) {
        console.error('Error fetching matches:', error);
        // Handle error (e.g., show error message to user)
      }
    };

    fetchMatches();
  }, [token, leagueId]);

  const postPrediction = async (prediction: Prediction) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/predictions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(token)}`
        },
        body: JSON.stringify(prediction),
      });
      if (!response.ok) {
        throw new Error('Failed to post prediction');
      }
      // Remove the match from the list after a successful prediction
      setMatches((prevMatches) => prevMatches.filter(match => match.id !== prediction.fixture_id));
    } catch (error) {
      console.error('Error posting prediction:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handlePredictionChange = debounce((fixtureId: number, homeScore: number | null, awayScore: number | null) => {
    // Validate that both scores are selected
    if (homeScore === null || awayScore === null) return;

    const prediction = { fixture_id: fixtureId, home_prediction_score: homeScore, away_prediction_score: awayScore };
    setPredictions((prevPredictions) => ({
      ...prevPredictions,
      [fixtureId]: prediction,
    }));
    postPrediction(prediction); // Debounced function to avoid rapid API calls
  }, 600);

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>, fixtureId: number, type: 'home' | 'away') => {
    const value = e.target.value === "" ? null : parseInt(e.target.value);

    const currentPrediction = predictions[fixtureId] || { fixture_id: fixtureId, home_prediction_score: null, away_prediction_score: null };
    const updatedPrediction = type === 'home'
      ? { ...currentPrediction, home_prediction_score: value }
      : { ...currentPrediction, away_prediction_score: value };

    setPredictions((prevPredictions) => ({
      ...prevPredictions,
      [fixtureId]: updatedPrediction,
    }));

    if (updatedPrediction.home_prediction_score !== null && updatedPrediction.away_prediction_score !== null) {
      handlePredictionChange(fixtureId, updatedPrediction.home_prediction_score, updatedPrediction.away_prediction_score);
    }
  };

  // Options for score selection (0 to 12)
  const scoreOptions = Array.from({ length: 13 }, (_, i) => i);
  
  return (
    <div className="container mx-auto w-2/4 p-4">
      {matches.length === 0 ? (
        <div className="text-center text-gray-500">No matches available</div>
      ) : (
        matches.map((match) => (
          <div key={match.id} className="border p-4 mb-4 rounded-lg shadow-md bg-white">
            <div className="flex justify-between items-center text-sm text-gray-500">
            <span>{match.league.name}</span>
              <span>{new Date(match.match_date).toLocaleString()}</span>
              
            </div>
            <div className="mt-2 flex justify-between items-center">
              <span className="font-bold">{match.home_team}</span>
              <span className="text-gray-500">vs</span>
              <span className="font-bold ">{match.away_team}</span>
            </div>
            <div className="mt-2 text-center">
              {match.home_team_ft_score !== null && match.away_team_ft_score !== null ? (
                <div className="text-lg">
                  <span className="font-bold">{match.home_team_ft_score}</span> - <span className="font-bold">{match.away_team_ft_score}</span>
                </div>
              ) : (
                <div className="text-gray-500">Score not available</div>
              )}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Home Score</label>
                <select
                  title='homescore'
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  onChange={(e) => handleSelectChange(e, match.id, 'home')}
                >
                  <option value="">Select</option>
                  {scoreOptions.map(score => (
                    <option key={score} value={score}>{score}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Away Score</label>
                <select
                  title='awayscorea'
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  onChange={(e) => handleSelectChange(e, match.id, 'away')}
                >
                  <option value="">Select</option>
                  {scoreOptions.map(score => (
                    <option key={score} value={score}>{score}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MatchList;