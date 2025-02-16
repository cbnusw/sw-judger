import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from '@/app/login/page';
import axiosInstance from '@/utils/axiosInstance';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('@/utils/axiosInstance', () => ({
  post: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/third-party/ChannelTalk', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    loadScript: jest.fn(),
    boot: jest.fn(),
    shutdown: jest.fn(), // shutdown 메서드 추가
  })),
}));

describe('Login Page', () => {
  const mockedAxiosPost = axiosInstance.post as jest.Mock;
  const mockedUseRouter = useRouter as jest.Mock;
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    mockedAxiosPost.mockReset();
    mockedUseRouter.mockReset();
    jest.spyOn(Storage.prototype, 'setItem'); // Mock localStorage.setItem
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks after each test
  });

  const renderWithQueryClient = (ui: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
    );
  };

  it('logs in successfully and redirects to the home page', async () => {
    const mockPush = jest.fn();
    mockedUseRouter.mockReturnValue({ push: mockPush });

    // Mock API response
    mockedAxiosPost.mockResolvedValueOnce({
      data: {
        data: {
          accessToken: 'mockAccessToken',
          refreshToken: 'mockRefreshToken',
        },
      },
    });

    renderWithQueryClient(<Login />);

    // Find input fields and button
    const idInput = screen.getByLabelText(/학번\/교번/i);
    const pwdInput = screen.getByLabelText(/비밀번호/i);
    const loginButton = screen.getByRole('button', { name: /로그인/i });

    // Simulate user input
    fireEvent.change(idInput, { target: { value: 'test-id' } });
    fireEvent.change(pwdInput, { target: { value: 'test-password' } });

    // Click login button
    fireEvent.click(loginButton);

    // Wait for API and interactions
    await waitFor(() => {
      expect(mockedAxiosPost).toHaveBeenCalledWith('/auth/login', {
        no: 'test-id',
        password: 'test-password',
      });
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'access-token',
        'mockAccessToken',
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'refresh-token',
        'mockRefreshToken',
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'activeAuthorization',
        'true',
      );
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('shows error when login fails due to wrong credentials', async () => {
    const mockPush = jest.fn();
    mockedUseRouter.mockReturnValue({ push: mockPush });

    // Mock 실패 API 응답 (401 에러)
    mockedAxiosPost.mockRejectedValueOnce({
      response: {
        status: 401,
        data: {
          message: 'Invalid credentials', // 서버가 반환하는 메시지
        },
      },
    });

    renderWithQueryClient(<Login />);

    // Find input fields and button
    const idInput = screen.getByLabelText(/학번\/교번/i);
    const pwdInput = screen.getByLabelText(/비밀번호/i);
    const loginButton = screen.getByRole('button', { name: /로그인/i });

    // Simulate user input
    fireEvent.change(idInput, { target: { value: 'wrong-id' } });
    fireEvent.change(pwdInput, { target: { value: 'wrong-password' } });

    // Click login button
    fireEvent.click(loginButton);

    // Wait for API and error message
    await waitFor(() => {
      // Mock 함수가 실패한 경로와 데이터를 받았는지 확인
      expect(mockedAxiosPost).toHaveBeenCalledWith('/auth/login', {
        no: 'wrong-id',
        password: 'wrong-password',
      });

      // 에러 메시지가 화면에 표시되었는지 확인
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();

      // 리다이렉트가 발생하지 않았는지 확인
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
