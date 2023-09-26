const express = require("express")
const app = express()
const http = require("http")
const axios = require("axios")
const server = http.createServer(app)
const line = require("@line/bot-sdk")
const fs = require("fs")
const { XMLParser, XMLBuilder } = require("fast-xml-parser");
const xp = new XMLParser()
const position ={
    latitude:"35.6243238",//北緯
    longitude:"139.710821"//東経
}
const yahooAPIID = "dj00aiZpPTBESGIxbUltVzZWYiZzPWNvbnN1bWVyc2VjcmV0Jng9Njk-"

const messList = {
    sunny:{
        text:"【朝練情報】\n現在の学校の周辺の天気は晴れです。\n朝練は予定通り行われる可能性が高いです。",
    },
    cloudry:{
        text:"【朝練情報】\n現在の学校の周辺の天気は曇りです。\n雨は降っていないため予定通り朝練が行われる可能性が高いです。"
    },
    rain:{
        text:"【朝練情報】\n現在の学校周辺の天気は雨です。\n朝練は中止になる可能性があります。"
    }
}

const client = new line.Client({
    channelAccessToken:"fV79bak35FFDvHGODA1w515QuUXWQyLjuyIMGxspyOD2wdGPAdCQ4JaTpzWOUVHZZmK8/+7T0WFhhkYiQjQP1O3c2Us6G31K8GFdXSMtUd7u4h2rLd5yvluNguo5GfwtIft5SwZSuQpPWs3/Ti8kMwdB04t89/1O/w1cDnyilFU="
})
const config = {
    channelSecret: '4cf6c51130c18f22a4824271afd9ee27',
    channelAccessToken: 'fV79bak35FFDvHGODA1w515QuUXWQyLjuyIMGxspyOD2wdGPAdCQ4JaTpzWOUVHZZmK8/+7T0WFhhkYiQjQP1O3c2Us6G31K8GFdXSMtUd7u4h2rLd5yvluNguo5GfwtIft5SwZSuQpPWs3/Ti8kMwdB04t89/1O/w1cDnyilFU='
}
const apiURL = `https://map.yahooapis.jp/weather/V1/place?coordinates=${position.longitude},${position.latitude}&appid=${yahooAPIID}`
const sendMess = async(sendText)=>{
    try{

        const mess = {
            type:"text",
            text:sendText
        }
        const res = await client.broadcast(mess)
        console.log(res)
    }catch{
        console.log("送信に失敗")
    }
}
const getWeather = async()=>{
    try{
        const res = await axios.get(apiURL,{})
        const parsedData = xp.parse(res.data)
        console.log(parsedData.YDF.Feature.Property.WeatherList)
        const weatherList = parsedData.YDF.Feature.Property.WeatherList.Weather
        if(weatherList[0].Rainfall == 0){
            sendMess(messList.sunny.text)
        }else if(weatherList[0].Rainfall >= 0.1 && weatherList[0].Rainfall <= 0.2){
            sendMess(messList.cloudry.text)
        }else if(weatherList[0].Rainfall >= 0.3){
            sendMess(messList.rain.text)
        }
    }catch(err){
        console.log(err)
    }
}
app.use(express.json())
app.get("/", (req, res) => {
    res.sendStatus(200);
  });
  
app.get("/send",(req,res)=>{
    getWeather()
})
app.post("/webhook",(req,res)=>{
    console.log("fdsfdsf"+req.body.events)
    try{
        res.sendStatus(200)
    }catch{

    }
})

server.listen(3000,()=>{
    console.log("server run")
})