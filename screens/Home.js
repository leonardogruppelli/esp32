import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {
  faThermometerEmpty,
  faThermometerQuarter,
  faThermometerThreeQuarters,
  faThermometerHalf,
  faThermometerFull,
  faToggleOn,
  faToggleOff
} from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components/native'
import axios from 'axios'

const Home = ({ navigation }) => {
  const [timer, setTimer] = useState(0)
  const [temperature, setTemperature] = useState(20)
  const [led, setLed] = useState(false)
  const [icon, setIcon] = useState(faThermometerEmpty)
  const [color, setColor] = useState('#55e03c')

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(timer => timer + 1)
    }, 20000)

    return () => {
      clearInterval(interval);
    }
  }, [])

  useEffect(() => {
    const getTemperature = async () => {
      try {
        const { data } = await axios.get('https://api.thingspeak.com/channels/879309/feed.json')
        setTemperature(temperature => temperature + 1)
      } catch (error) {
        console.log(error.response)
      }
    }

    getTemperature()
  }, [timer])

  useEffect(() => {
    const getIcon = () => {
      if (temperature < 30) {
        setIcon(faThermometerEmpty)
        setColor('#8beb2a')
      } else if (temperature < 38) {
        setIcon(faThermometerQuarter)
        setColor('#e1eb2a')
      } else if (temperature < 43) {
        setIcon(faThermometerHalf)
        setColor('#ebce2a')
      } else if (temperature < 51) {
        setIcon(faThermometerThreeQuarters)
        setColor('#eb8b2a')
      } else {
        setIcon(faThermometerFull)
        setColor('#eb2a2a')
      }
    }

    getIcon()
  }, [temperature])

  const toggleLed = async (value) => {
    try {
      const { data } = await axios.post(
        'http://api.thingspeak.com/update',
        {
          key: 'RZHWJLUOHIG58HOD',
          field3: value ? 1 : 0
        }
      )
    } catch (error) {
      console.log(error.response)
    } finally {
      setLed(value)
    }
  }

  return (
    <Container
      justify="center"
      align="center"
    >
      <Title>ESP<Highlight>32</Highlight></Title>
      <Subtitle>controle de temperatura</Subtitle>

      <Row>
        <Column>
          <Btn activeOpacity={0.8}>
            <FontAwesomeIcon icon={icon} size={60} color={color} />
            <BtnContent>
              <BtnTxt>temperatura</BtnTxt>
              <BtnTemperature>{temperature} ºC</BtnTemperature>
            </BtnContent>
          </Btn>
        </Column>
      </Row>

      <Row>
        <Column>
          <Btn direction="column" onPress={() => toggleLed(!led)} activeOpacity={0.8}>
            <BtnTxt>led</BtnTxt>
            <Toggle on={!!led}>
              <ToggleIcon on={!!led} />
            </Toggle>
          </Btn>
        </Column>
      </Row>
    </Container>
  )
}

const Container = styled.View`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: ${props => props.justify ? props.justify : 'flex-start'};
    align-items: ${props => props.align ? props.align : 'flex-start'};
    flex-direction: ${props => props.direction ? props.direction : 'column'};
    padding: 10px;
    background-color: #1b1b1b;
`

const Title = styled.Text`
    align-self: flex-start;
    margin: 10px 10px 0;
    font-size: 38px;
    color: #0587d5;
    text-transform: uppercase;
`

const Highlight = styled.Text`
    color: #70caff;
`

const Subtitle = styled.Text`
    align-self: flex-start;
    margin: 0 10px 25px;
    font-size: 22px;
    color: #70caff;
`

const Row = styled.View`
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
`

const Column = styled.View`
    display: flex;
    flex-direction: column;
    flex-basis: 100%;
    flex: 1;
`

const Btn = styled.TouchableOpacity`
    display: flex;
    flex-direction: ${props => props.direction ? props.direction : 'row'};
    align-items: center;
    padding: 30px 20px;
    margin: 10px;
    background-color: #161616;
    box-shadow: 0 0 3px rgba(51, 51, 51, 0.4);
    border-radius: 6px;
`

const BtnContent = styled.View`
    display: flex;
    flex-direction: column;
    margin-left: 20px;
`

const BtnTxt = styled.Text`
    margin-bottom: 5px;
    font-size: 14px;
    color: #0587d5;
    text-transform: uppercase;
`

const BtnTemperature = styled.Text`
    font-size: 42px;
    color: #70caff;
    text-transform: uppercase;
`

const Toggle = styled.View`
    width: 80px;
    height: 50px;
    position: relative;
    margin-top: 10px;
    background-color: ${props => props.on ? '#0587d5' : '#1b1b1b'};
    border: 2px solid #eee;
    border-radius: 30px;
`

const ToggleIcon = styled.View`
    width: 30px;
    height: 30px;
    position: absolute;
    top: 8px;
    left: ${props => props.on ? '38px' : '8px'};
    background-color: ${props => props.on ? '#70caff' : '#fff'};
    border: 2px solid #eee;
    border-radius: 50;
`

export default Home