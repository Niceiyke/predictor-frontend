interface UserLogin{
    username:string
    password:string
}

interface UserRegistration{
    username:string
    email:string
    password:string
}

interface User{
    id: number
    username: string
    email: string
    is_admin: boolean | null
    point:number
}

interface League{
    id:number
    name:string
    premium:boolean
}

  
  interface Fixture {
    id: number
    home_team: string
    away_team: string
    match_week:number
    match_date: string
    league: League
    home_team_ft_score: string | null
    away_team_ft_score: string | null
    result:string
    status:string
  }
  
  interface Prediction {
    id?: number
    fixture?: Fixture
    home_prediction_score:string|null
    away_prediction_score:string|null
    user?: User
    result?:string
    correct_score?:string
  }

  interface PostPrediction {
    fixture_id: number
    home_prediction_score:string|null
    away_prediction_score:string|null
  }