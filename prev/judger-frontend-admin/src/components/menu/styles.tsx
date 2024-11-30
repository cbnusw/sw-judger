import styled from '@emotion/styled'

export const MenuBar = styled.div`
  position: fixed;
  width: 300px;
  height: 100vh;
  background-color: rgba(var(--sk_primary_foreground, 29, 28, 29), 1);
  vertical-align: top;
  text-align: center;
  color: white;
  header {
    background-color: #09f;
    width: 100%;
    display: block;
    padding: 20px 0px;
  }
`

export const ListWrapper = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 40px;
`

export const MenuList = styled.li`
  margin: 0;
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.9);
    @include transition(all 0.6s ease);
  }
`
