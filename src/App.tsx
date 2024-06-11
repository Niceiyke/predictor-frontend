import React, { useState } from 'react';
import FootballFixtures from './components/FootballFixtures';

const App: React.FC = () => {
  const initialFixtures = [
    { homeTeam: 'Team A', awayTeam: 'Team B',homeScore:'1', awayScore:'3',finalHomeScore:2,finalAwayScore:2},
    { homeTeam: 'Team C', awayTeam: 'Team D' },
    { homeTeam: 'Team E', awayTeam: 'Team F' },
  ];

  const [fixtures, setFixtures] = useState(initialFixtures);


  interface Fixture {
    homeTeam: string;
    awayTeam: string;
    homeScore?: number;
    awayScore?: number;
    finalHomeScore?: number;
    finalAwayScore?: number;
  }
  const handleSubmit = (updatedFixtures: Fixture[]) => {
    // Handle the API call to submit the updated fixtures here
    console.log('Updated Fixtures:', updatedFixtures);

    // Simulate API call and update the fixtures state with final results
    setFixtures(updatedFixtures);

    // Example API call
    // fetch('/api/update-fixtures', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(updatedFixtures),
    // })
    // .then(response => response.json())
    // .then(data => console.log('Success:', data))
    // .catch(error => console.error('Error:', error));
  };

  return (
    <div className="App">
      <FootballFixtures fixtures={fixtures} onSubmit={handleSubmit} />
    </div>
  );
};

export default App;
