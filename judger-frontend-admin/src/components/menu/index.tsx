import React from 'react'
import { ListWrapper, MenuBar, MenuList } from './styles'

function Menu() {
  return (
    <MenuBar>
      <header>메뉴</header>
      <ListWrapper>
        <MenuList>
          <span>과제 등록</span>
        </MenuList>
        <MenuList>
          <span>과제 확인</span>
        </MenuList>
        <MenuList>
          <span>로그아웃</span>
        </MenuList>
      </ListWrapper>
    </MenuBar>
  )
}
export default Menu
