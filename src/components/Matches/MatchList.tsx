import React, { useEffect, useState, ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { useAuth } from '../../context/AuthContext';
import { axiosInstance } from '../../../config/https';

const MatchList: React.FC = () => {
  const { token } = useAuth(); 
  const { leagueId } = useParams<{ leagueId: string }>();
  const [matches, setMatches] = useState<Fixture[]>([]);
  const [predictions, setPredictions] = useState<Record<string, Prediction>>({});


  useEffect(() => {
    const fetchMatches = async () => {

      try {
        const response = await axiosInstance.get(`/fixtures/user/not-predicted?league_id=${leagueId}`);
        if (response.status === 404) {
          console.log(response.data);
        }

        if (response.status === 200) {
          const data: Fixture[] = await response.data;
          setMatches(data);
        }
      } catch (error) {
        console.error('Error fetching matches:', error);

      }
    };

    fetchMatches();
  }, [token, leagueId]);

  const postPrediction = async (prediction: Prediction) => {
    try {
      const response = await axiosInstance.post(`/predictions`, prediction);
      if (response.status === 401) {
        throw new Error('Failed to post prediction');
      }

      setMatches((prevMatches) => prevMatches.filter(match => match.id !== prediction.fixture_id));
    } catch (error) {
      console.error('Error posting prediction:', error);

    }
  };

  const handlePredictionChange = debounce((fixtureId: number, homeScore: string | null, awayScore: string | null) => {
    if (homeScore === null || awayScore === null) return;

    const prediction = { fixture_id: fixtureId, home_prediction_score: homeScore, away_prediction_score: awayScore };
    setPredictions((prevPredictions) => ({
      ...prevPredictions,
      [fixtureId]: prediction,
    }));
    postPrediction(prediction);
  }, 600);

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>, fixtureId: number, type: 'home' | 'away') => {
    const value = e.target.value === "" ? null : e.target.value;

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

  const scoreOptions = Array.from({ length: 13 }, (_, i) => i);
  
  return (
    <div className="container mx-auto w-4/6 p-4">
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
              <span className="font-bold">{match.away_team}</span>
            </div>

            <div className="mt-2 flex justify-around">
              <div>
                <label className="block text-sm font-medium text-gray-700">Home Score</label>
                <select
                  title="homescore"
                  className="mt-1 block w-full h-10 rounded-md text-white text-center bg-gray-700 border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                  title="awayscorea"
                  className="mt-1 block w-full h-10 rounded-md text-white text-center bg-gray-700 border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
