import styled from 'styled-components'

const StyledDivider = styled.div`
  height: ${(props) => (props.style?.height ? props.style.height : '1px')};
  width: ${(props) => (props.style?.width ? props.style.width : '100%')};
  margin: ${(props) => (props.style?.margin ? props.style.margin : '10px 0')};
  background-color: #${(props) => (props.style?.color ? props.style.color : 'd7d7d7')};
`

export default StyledDivider
