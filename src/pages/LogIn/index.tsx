import React, { useCallback } from 'react';
import { Header, Form, Label, Input, LinkContainer, Button } from './styles';
import useInput from '../../hooks/useInput';

function LogIn() {
  const [eduNumber, onChangeEduNumber] = useInput('');
  const [password, onChangePassword] = useInput('');
  const onSubmit = useCallback((e) => {
    e.preventDefault();
  }, []);
  return (
    <div id="container">
      <Header>SW JUDGER 관리자 로그인</Header>
      <Form onSubmit={onSubmit}>
        <Label id="edunumber-label">
          <span>학번/교번 또는 아이디</span>
          <div>
            <Input
              type="eduNumber"
              id="eduNumber"
              name="email"
              value={eduNumber}
              onChange={onChangeEduNumber}
              placeholder="충북대 소속의 경우 학번/교번 입력, 그외 아이디 입력"
            />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChangePassword}
              placeholder="비밀번호 입력"
            />
          </div>
          {/*{logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}*/}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <a href="/signup">회원가입 하러가기</a>
      </LinkContainer>
    </div>
  );
}
export default LogIn;
