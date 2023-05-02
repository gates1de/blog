import styled from 'styled-components'

type Props = {
  aspectRatio?: number
  videoURL: string
  width?: number
}

export const YoutubeContainer = ({
  aspectRatio = 9 / 16,
  videoURL,
  width,
}: Props) => {
  const adjustmentWidth = width ? Math.min(width, 600) : 600
  return (
    <Container>
      <iframe
        id="ytplayer"
        src={videoURL}
        height={aspectRatio ? aspectRatio * adjustmentWidth : 'auto'}
        width={adjustmentWidth}
      />
    </Container>
  )
}

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 2rem auto;
  padding-left: calc(24px + env(safe-area-inset-left));
  padding-right: calc(24px + env(safe-area-inset-right));
  width: 100%;
`
