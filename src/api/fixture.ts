
const baseUrl ='http://127.0.0.1:8000/fixtures/'


export const get_all_fixtures =async()=>{
    return await fetch(baseUrl)

}