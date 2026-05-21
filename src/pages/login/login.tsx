import { Link, useNavigate } from "react-router-dom";
import { Button, CenterPage, Field, Logo, Panel } from "../../components/openpark/ui";

const LoginPage = () => {
  const navigate = useNavigate();

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
              navigate("/select");
            }}
          >
            <div className="flex w-full flex-col gap-4">
              <Field label="아이디" placeholder="아이디 입력" />
              <div className="flex flex-col gap-1">
                <Field label="비밀번호" placeholder="비밀번호 입력" type="password" />
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

            <Button type="submit" className="w-full">
              로그인
            </Button>
          </form>
        </div>
      </Panel>
    </CenterPage>
  );
};

export default LoginPage;
