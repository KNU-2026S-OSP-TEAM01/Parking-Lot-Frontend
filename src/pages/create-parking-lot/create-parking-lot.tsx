import { useState } from "react";
import { Button, CardTitle, Field, Panel } from "../../components/openpark/ui";

type CreateParkingLotPageProps = {
  onCreated?: () => void;
};

const FeeToggle = ({
  enabled,
  onClick,
}: {
  enabled: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex h-6 w-14 items-center justify-between overflow-hidden rounded-full py-1 text-white ${
      enabled ? "bg-blue-500 pl-1.5 pr-1" : "bg-slate-300 pl-1 pr-1.5"
    }`}
  >
    {enabled ? (
      <span className="text-xs font-black leading-4">ON</span>
    ) : (
      <span className="size-4 rounded-full bg-white" />
    )}
    {enabled ? (
      <span className="size-4 rounded-full bg-white" />
    ) : (
      <span className="text-xs font-black leading-4">OFF</span>
    )}
  </button>
);

const CreateParkingLotPage = ({ onCreated }: CreateParkingLotPageProps) => {
  const [feeEnabled, setFeeEnabled] = useState(false);

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-2.5">
      <Panel className="max-w-[384px] rounded-md border-slate-200 p-3.5">
        <div className="flex flex-col gap-2.5">
          <CardTitle>주차장 생성</CardTitle>

          <form
            className="flex w-full flex-col gap-2.5"
            onSubmit={(event) => {
              event.preventDefault();
              onCreated?.();
            }}
          >
            <Field label="주차장 이름 *" placeholder="주차장 이름 입력" />
            <Field label="주소" placeholder="주소 입력" />
            <Field
              label="주차 가능 대수 *"
              placeholder="주차 가능 대수 입력"
              inputMode="numeric"
              icon="uil:sort"
            />

            <div className="flex w-full items-center justify-between">
              <span className="text-sm font-normal leading-5 text-slate-800">
                요금
              </span>
              <FeeToggle
                enabled={feeEnabled}
                onClick={() => setFeeEnabled((value) => !value)}
              />
            </div>

            {feeEnabled ? (
              <>
                <Field
                  label="기본 요금"
                  placeholder="기본 요금 입력"
                  inputMode="numeric"
                  icon="uil:sort"
                />
                <Field
                  label="기본 요금 적용 시간 (분)"
                  placeholder="기본 요금 적용 시간 입력"
                  inputMode="numeric"
                  icon="uil:sort"
                />
                <Field
                  label="추가 요금"
                  placeholder="추가 요금 입력"
                  inputMode="numeric"
                  icon="uil:sort"
                />
                <Field
                  label="추가 요금 단위 시간 (분)"
                  placeholder="추가 요금 단위 시간 입력"
                  inputMode="numeric"
                  icon="uil:sort"
                />
              </>
            ) : null}

            <Button type="submit" className="w-full">
              주차장 만들기
            </Button>
          </form>
        </div>
      </Panel>
    </main>
  );
};

export default CreateParkingLotPage;
