import styled from "styled-components"

export const Canvas = styled.canvas`
  max-width: 80%;
  max-height: 550px;
  user-select: none;
  cursor: pointer;
`

export const Actions = styled.div`
  display: flex;
  max-width: 80%;
  width: 100%;
  margin: 40px auto;
  height: 70px;
  justify-content: space-between;
`

export const Button = styled.button`
  background: #fff;
  width: calc(100% / 3 - 40px);
  border: 1px solid #dedede;
  cursor: pointer;
  color: #a2a5a8;
  font-size: 13px;
  user-select: none;
  border-radius: 5px;
`

export const Input = styled.input`
  background: #fff;
  width: 100%;
  border: 1px solid #dedede;
  cursor: pointer;
  text-align: center;
  height: 100%;
  border-radius: 5px;
  width: calc(100% / 3 - 40px);
  color: #a2a5a8;
  font-size: 13px;
`

export const Label = styled.label`
  display: flex;
  flex-direction: column;
  width: calc(100% / 3 - 40px);
  color: #a2a5a8;
  font-size: 13px;
  user-select: none;
`

export const Info = styled.h2`
  position: absolute;
  top: 50px;
  color: #ff0033;
`
