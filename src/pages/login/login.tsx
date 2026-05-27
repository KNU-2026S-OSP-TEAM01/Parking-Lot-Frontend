import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useLoginApiV1LoginPost } from "../../api/generated";
import {
  Button,
  CenterPage,
  Field,
  Logo,
  Panel,
} from "../../components/openpark/ui";
import { getApiErrorMessage } from "../../services/apiError";
import { getSafeRedirectPath } from "../../services/api";

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLoginApiV1LoginPost({
    mutation: {
      onSuccess: (token) => {
        sessionStorage.setItem("accessToken", token.access_token);
        sessionStorage.removeItem("refreshToken");
        navigate(getSafeRedirectPath(searchParams.get("redirect")), {
          replace: true,
        });
      },
    },
  });

  const errorMessage = loginMutation.isError
    ? getApiErrorMessage(loginMutation.error, "아이디 또는 비밀번호를 확인해 주세요.")
    : null;

  return (
    <CenterPage>
      <Panel className="max-w-[384px] border-slate-300 p-8">
        <div className="flex flex-col items-start gap-6">
          <div className="flex items-end justify-center gap-1.5">
            <Logo />
            <p className="whitespace-nowrap text-xs font-normal leading-4 text-slate-500">
              오픈소스 주차장 관리 플랫폼
            </p>
          </div>

          <form
            className="flex w-full flex-col gap-6"
            onSubmit={(event) => {
              event.preventDefault();
              loginMutation.mutate({
                data: {
                  username: username.trim(),
                  password,
                },
              });
            }}
          >
            <div className="flex w-full flex-col gap-4">
              <Field
                label="아이디"
                placeholder="아이디 입력"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                required
              />
              <div className="flex flex-col gap-1">
                <Field
                  label="비밀번호"
                  placeholder="비밀번호 입력"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                />
                <div className="flex h-4 justify-end">
                  <Link
                    to="/signup"
                    className="text-xs font-medium leading-4 text-slate-800"
                  >
                    회원가입
                  </Link>
                </div>
              </div>
            </div>

            {errorMessage ? (
              <p className="-mt-3 text-xs font-medium leading-4 text-red-500">
                {errorMessage}
              </p>
            ) : null}

            <Button
              type="submit"
              className="w-full disabled:cursor-not-allowed disabled:bg-slate-300"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "로그인 중..." : "로그인"}
            </Button>
          </form>
        </div>
      </Panel>
    </CenterPage>
  );
};

export default LoginPage;
