import React from 'react'
import { Route } from 'react-router-dom'

function Nav() {
  return (
    <nav>
      <ul>
        <li>
          <span>과제 등록하기</span>
        </li>
        <li>
          <span>과제 제출 확인</span>
        </li>
        <li>
          <span>로그아웃</span>
        </li>
      </ul>
    </nav>
  )
}
export default Nav
