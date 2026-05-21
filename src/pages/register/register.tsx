import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, CenterPage, Field, Logo, Panel } from "../../components/openpark/ui";

type RegisterStep = 1 | 2 | 3;

const Progress = ({ step }: { step: RegisterStep }) => (
  <div className="flex h-2 w-full gap-1 overflow-hidden">
    <div
      className={`h-2 min-w-0 flex-1 rounded-full ${
        step >= 2 ? "bg-green-500" : "bg-slate-100"
      }`}
    />
    <div
      className={`h-2 min-w-0 flex-1 rounded-full ${
        step >= 3 ? "bg-green-500" : "bg-slate-100"
      }`}
    />
  </div>
);

const RegisterPage = () => {
  const [step, setStep] = useState<RegisterStep>(1);
  const navigate = useNavigate();

  return (
    <CenterPage>
      <Panel className="max-w-[384px] border-slate-300 p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Logo />
            <div className="flex w-full flex-col gap-2.5">
              <h1 className="text-2xl font-bold leading-8 text-slate-900">
                회원가입
              </h1>
              <Progress step={step} />
            </div>
          </div>

          {step === 1 ? (
            <>
              <div className="flex min-h-56 w-full flex-col gap-4">
                <Field label="아이디 *" placeholder="아이디 입력" />
                <Field label="비밀번호 *" placeholder="비밀번호 입력" type="password" />
                <Field
                  label="비밀번호 확인 *"
                  placeholder="비밀번호 확인 입력"
                  type="password"
                />
              </div>
              <Button className="w-full" onClick={() => setStep(2)}>
                다음 단계
              </Button>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <div className="flex min-h-56 w-full flex-col">
                <Field label="닉네임 *" placeholder="닉네임 입력" />
              </div>
              <div className="flex w-full gap-1">
                <Button
                  tone="secondary"
                  className="min-w-0 flex-1"
                  onClick={() => setStep(1)}
                >
                  이전
                </Button>
                <Button className="min-w-0 flex-1" onClick={() => setStep(3)}>
                  회원가입
                </Button>
              </div>
            </>
          ) : null}

          {step === 3 ? (
            <>
              <div className="flex min-h-56 w-full items-center justify-center text-center">
                <div className="flex w-full flex-col gap-1">
                  <p className="text-base font-bold leading-6 text-slate-900">
                    회원가입이 완료되었습니다!
                  </p>
                  <p className="text-sm font-medium leading-5 text-slate-500">
                    서비스 이용을 위해 로그인 후 이용 바랍니다.
                  </p>
                </div>
              </div>
              <Button className="w-full" onClick={() => navigate("/login")}>
                로그인
              </Button>
            </>
          ) : null}
        </div>
      </Panel>
    </CenterPage>
  );
};

export default RegisterPage;

