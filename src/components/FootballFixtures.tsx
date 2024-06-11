import React, { useState } from 'react';

interface Fixture {
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  finalHomeScore?: number;
  finalAwayScore?: number;
}

interface FootballFixturesProps {
  fixtures: Fixture[];
  onSubmit: (updatedFixtures: Fixture[]) => void;
}

const FootballFixtures: React.FC<FootballFixturesProps> = ({ fixtures, onSubmit }) => {
  const [scores, setScores] = useState<Fixture[]>(fixtures);

  const handleScoreChange = (index: number, team: 'home' | 'away', value: number) => {
    const updatedScores = [...scores];
    if (team === 'home') {
      updatedScores[index].homeScore = value;
    } else {
      updatedScores[index].awayScore = value;
    }
    setScores(updatedScores);
  };

  const handleSubmit = () => {
    const updatedScores = scores.map(fixture => ({
      ...fixture,
      finalHomeScore: fixture.homeScore,
      finalAwayScore: fixture.awayScore,
    }));
    onSubmit(updatedScores);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Football Fixtures</h1>
      <div className="grid gap-6">
        {scores.map((fixture, index) => (
          <div key={index} className="p-6 border rounded-lg shadow-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-semibold">{fixture.homeTeam}</span>
              <input
                type="number"
                className="w-16 p-2 border rounded-lg text-center"
                value={fixture.homeScore ?? ''}
                onChange={(e) => handleScoreChange(index, 'home', parseInt(e.target.value))}
                placeholder="Score"
              />
              <span className="text-xl mx-2">vs</span>
              <input
                type="number"
                className="w-16 p-2 border rounded-lg text-center"
                value={fixture.awayScore ?? ''}
                onChange={(e) => handleScoreChange(index, 'away', parseInt(e.target.value))}
                placeholder="Score"
              />
              <span className="text-xl font-semibold">{fixture.awayTeam}</span>
            </div>
            {fixture.finalHomeScore !== undefined && fixture.finalAwayScore !== undefined && (
              <div className="text-center mt-4">
                <span className="text-lg font-bold">Final Result: </span>
                <span className="text-lg">
                  {fixture.finalHomeScore} - {fixture.finalAwayScore}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      <button
        className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-300"
        onClick={handleSubmit}
      >
        Submit Scores
      </button>
    </div>
  );
};

export default FootballFixtures;
