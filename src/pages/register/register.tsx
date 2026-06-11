import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignupApiV1SignupPost } from "../../api/generated";
import {
  Button,
  CenterPage,
  Field,
  Logo,
  Panel,
} from "../../components/openpark/ui";
import { getApiErrorMessage } from "../../services/apiError";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [username, setUsername] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();
  const signupMutation = useSignupApiV1SignupPost({
    mutation: {
      onSuccess: () => {
        setFormError(null);
        setStep(3);
      },
      onError: (error) => {
        setFormError(
          getApiErrorMessage(error, "회원가입 요청을 처리하지 못했습니다.")
        );
      },
    },
  });

  const goNextStep = () => {
    if (!username.trim() || !password || !passwordConfirm) {
      setFormError("필수 값을 모두 입력해 주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      setFormError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setFormError(null);
    setStep(2);
  };

  const submitSignup = () => {
    if (!email.trim()) {
      setFormError("필수 값을 모두 입력해 주세요.");
      return;
    }

    signupMutation.mutate({
      data: {
        username: username.trim(),
        email: email.trim(),
        password,
      },
    });
  };

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
                <Field
                  label="아이디 *"
                  placeholder="아이디 입력"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
                  required
                />
                <Field
                  label="비밀번호 *"
                  placeholder="비밀번호 입력"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  required
                />
                <Field
                  label="비밀번호 확인 *"
                  placeholder="비밀번호 확인 입력"
                  type="password"
                  value={passwordConfirm}
                  onChange={(event) => setPasswordConfirm(event.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>
              {formError ? (
                <p className="-mt-2 text-xs font-medium leading-4 text-red-500">
                  {formError}
                </p>
              ) : null}
              <Button className="w-full" onClick={goNextStep}>
                다음 단계
              </Button>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <div className="flex min-h-56 w-full flex-col">
                <Field
                  label="이메일 *"
                  placeholder="이메일 입력"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              {formError ? (
                <p className="-mt-2 text-xs font-medium leading-4 text-red-500">
                  {formError}
                </p>
              ) : null}
              <div className="flex w-full gap-1">
                <Button
                  tone="secondary"
                  className="min-w-0 flex-1"
                  onClick={() => {
                    setFormError(null);
                    setStep(1);
                  }}
                  disabled={signupMutation.isPending}
                >
                  이전
                </Button>
                <Button
                  className="min-w-0 flex-1 disabled:cursor-not-allowed disabled:bg-slate-300"
                  onClick={submitSignup}
                  disabled={signupMutation.isPending}
                >
                  {signupMutation.isPending ? "처리 중..." : "회원가입"}
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
