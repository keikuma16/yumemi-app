import { useState, useEffect} from 'react';
import axios from 'axios';
import './App.css'
import { PivotPopulationData } from './PivotPopulationData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function App() {
  //都道府県の一覧
  const [prefectures, setPrefectures] = useState([]);
  //apiから都道府県のデータの取得
  useEffect(() => {
    const API_KEY = import.meta.env.VITE_YUMEMI_API_KEY
    const API_URL = '/api/v1/prefectures';
    

    axios.get(API_URL, {
      headers: {'X-API-KEY': API_KEY}
    })
    .then((res) => {
      console.log('データ取得成功', res.data);
      setPrefectures(res.data.result);
    })
    .catch((err) => {
      console.log('エラー発生', err);
    })
  },[])
  //選択された都道府県のリスト
  const[selectedCodes, setSelectedCodes] = useState([]);
  const box_checked = (prefCode) =>{
    const isChecked = selectedCodes.includes(prefCode);
    //含まれているならTrueなのでリストから消去する
    if(isChecked){
      const newCodes = selectedCodes.filter((code) => code != prefCode);
      setSelectedCodes(newCodes);
    }
    //含まれていないならFalseなのでリストに追加する
    else{
      const newCodes = [...selectedCodes,prefCode];
      setSelectedCodes(newCodes);
    }
  }
  //人口データの一覧
  const [poplation, setPopulation] = useState([]);
  //apiから人口のデータの取得
  useEffect(() => {
    const API_KEY = import.meta.env.VITE_YUMEMI_API_KEY
    const API_URL = '/api/v1/population/composition/perYear';
    if(selectedCodes.length == 0){
      setPopulation([]);
      return;
    }
    const requests = selectedCodes.map((prefCode) => {
      return axios.get(API_URL,{
        headers: {'X-API-KEY':API_KEY},
        params: {prefCode:prefCode,cityCode:'-'}
      });
    });
    Promise.all(requests)
      .then((requests) => {
        const rawData = requests[0].data.result;
        const formatData = PivotPopulationData(rawData);
        setPopulation(formatData);
        console.log(formatData);
      })
      .catch((err) => {
        console.log('エラーが発生しました',err)
      })
  },[selectedCodes])



  return (
    <div style={{padding: '20px'}}>
      <h1>ゆめみ課題 : 都道府県リスト</h1>
      <div style={{ width: '100%', height: 400, marginTop: '20px' }}>
        <ResponsiveContainer>
          <LineChart
            data={poplation}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            
            {/* せっかくデータにあるので、4本とも線を引きましょう！ */}
            <Line type="monotone" dataKey="総人口" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="年少人口" stroke="#82ca9d" />
            <Line type="monotone" dataKey="生産年齢人口" stroke="#ffc658" />
            <Line type="monotone" dataKey="老年人口" stroke="#ff7300" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <ul style={{textAlign: 'left'}}>
        {prefectures && prefectures.map((pref) => (
          <li key={pref.prefCode}>
          <input type="checkbox"  onChange={() => box_checked(pref.prefCode)}/> 
          {pref.prefCode}: {pref.prefName}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App
