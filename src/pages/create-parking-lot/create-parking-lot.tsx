import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  getListLotsApiV1LotsGetQueryKey,
  type LotOut,
  useCreateLotApiV1LotsPost,
} from "../../api/generated";
import { Button, CardTitle, Field, Panel } from "../../components/openpark/ui";
import { getApiErrorMessage } from "../../services/apiError";

type CreateParkingLotPageProps = {
  onCreated?: (lot: LotOut) => void;
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
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [totalSpaces, setTotalSpaces] = useState("");
  const [baseFee, setBaseFee] = useState("");
  const [baseDurationMinutes, setBaseDurationMinutes] = useState("");
  const [extraFeePerUnit, setExtraFeePerUnit] = useState("");
  const [extraFeeUnitMinutes, setExtraFeeUnitMinutes] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const createLotMutation = useCreateLotApiV1LotsPost({
    mutation: {
      onSuccess: (lot) => {
        queryClient.invalidateQueries({
          queryKey: getListLotsApiV1LotsGetQueryKey(),
        });
        setFormError(null);
        onCreated?.(lot);
      },
      onError: (error) => {
        setFormError(
          getApiErrorMessage(error, "주차장을 생성하지 못했습니다.")
        );
      },
    },
  });

  const toNumber = (value: string) => Number(value.replaceAll(",", ""));

  const submitCreateLot = () => {
    const totalSpacesNumber = toNumber(totalSpaces);
    const baseFeeNumber = toNumber(baseFee);
    const baseDurationMinutesNumber = toNumber(baseDurationMinutes);
    const extraFeePerUnitNumber = toNumber(extraFeePerUnit);
    const extraFeeUnitMinutesNumber = toNumber(extraFeeUnitMinutes);

    if (
      !name.trim() ||
      !Number.isFinite(totalSpacesNumber) ||
      totalSpacesNumber <= 0
    ) {
      setFormError("주차장 이름과 주차 가능 대수를 확인해 주세요.");
      return;
    }

    if (
      feeEnabled &&
      (!Number.isFinite(baseFeeNumber) ||
        !Number.isFinite(baseDurationMinutesNumber) ||
        !Number.isFinite(extraFeePerUnitNumber) ||
        !Number.isFinite(extraFeeUnitMinutesNumber) ||
        baseDurationMinutesNumber <= 0 ||
        extraFeeUnitMinutesNumber <= 0)
    ) {
      setFormError("요금 정보를 확인해 주세요.");
      return;
    }

    const data = {
      name: name.trim(),
      address: address.trim() || null,
      total_spaces: totalSpacesNumber,
      ...(feeEnabled
        ? {
            base_fee: baseFeeNumber,
            base_duration_minutes: baseDurationMinutesNumber,
            extra_fee_per_unit: extraFeePerUnitNumber,
            extra_fee_unit_minutes: extraFeeUnitMinutesNumber,
          }
        : {}),
    };

    createLotMutation.mutate({ data });
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-2.5">
      <Panel className="max-w-[384px] rounded-md border-slate-200 p-3.5">
        <div className="flex flex-col gap-2.5">
          <CardTitle>주차장 생성</CardTitle>

          <form
            className="flex w-full flex-col gap-2.5"
            autoComplete="off"
            onSubmit={(event) => {
              event.preventDefault();
              submitCreateLot();
            }}
          >
            <Field
              label="주차장 이름 *"
              placeholder="주차장 이름 입력"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="off"
              required
            />
            <Field
              label="주소"
              placeholder="주소 입력"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              autoComplete="off"
            />
            <Field
              label="주차 가능 대수 *"
              placeholder="주차 가능 대수 입력"
              inputMode="numeric"
              icon="uil:sort"
              value={totalSpaces}
              onChange={(event) => setTotalSpaces(event.target.value)}
              autoComplete="off"
              required
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
                  value={baseFee}
                  onChange={(event) => setBaseFee(event.target.value)}
                  autoComplete="off"
                  required={feeEnabled}
                />
                <Field
                  label="기본 요금 적용 시간 (분)"
                  placeholder="기본 요금 적용 시간 입력"
                  inputMode="numeric"
                  icon="uil:sort"
                  value={baseDurationMinutes}
                  onChange={(event) =>
                    setBaseDurationMinutes(event.target.value)
                  }
                  autoComplete="off"
                  required={feeEnabled}
                />
                <Field
                  label="추가 요금"
                  placeholder="추가 요금 입력"
                  inputMode="numeric"
                  icon="uil:sort"
                  value={extraFeePerUnit}
                  onChange={(event) => setExtraFeePerUnit(event.target.value)}
                  autoComplete="off"
                  required={feeEnabled}
                />
                <Field
                  label="추가 요금 단위 시간 (분)"
                  placeholder="추가 요금 단위 시간 입력"
                  inputMode="numeric"
                  icon="uil:sort"
                  value={extraFeeUnitMinutes}
                  onChange={(event) =>
                    setExtraFeeUnitMinutes(event.target.value)
                  }
                  autoComplete="off"
                  required={feeEnabled}
                />
              </>
            ) : null}

            {formError ? (
              <p className="text-xs font-medium leading-4 text-red-500">
                {formError}
              </p>
            ) : null}

            <Button
              type="submit"
              className="w-full disabled:cursor-not-allowed disabled:bg-slate-300"
              disabled={createLotMutation.isPending}
            >
              {createLotMutation.isPending ? "생성 중..." : "주차장 만들기"}
            </Button>
          </form>
        </div>
      </Panel>
    </main>
  );
};

export default CreateParkingLotPage;
