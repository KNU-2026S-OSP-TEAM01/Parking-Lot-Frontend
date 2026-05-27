import { Icon } from "@iconify/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { type LotOut, useListLotsApiV1LotsGet } from "../../api/generated";
import { DataText, CardTitle, Panel } from "../../components/openpark/ui";
import Skeleton from "../../components/ui/Skeleton";
import { getApiErrorMessage } from "../../services/apiError";
import { setSelectedParkingLotId } from "../../services/parkingLotSelection";
import CreateParkingLotPage from "../create-parking-lot/create-parking-lot";

const congestionMeta = (lot: LotOut) => {
  const used = lot.total_spaces - lot.available_spaces;
  const ratio = lot.total_spaces > 0 ? used / lot.total_spaces : 0;

  if (ratio >= 0.75) {
    return { label: "혼잡", className: "border-red-500 text-red-500" };
  }

  if (ratio >= 0.5) {
    return { label: "보통", className: "border-yellow-500 text-yellow-500" };
  }

  return { label: "여유", className: "border-blue-500 text-blue-500" };
};

const ParkingLotRow = ({ lot }: { lot: LotOut }) => {
  const navigate = useNavigate();
  const meta = congestionMeta(lot);
  const used = lot.total_spaces - lot.available_spaces;

  const selectParkingLot = () => {
    setSelectedParkingLotId(lot.id);
    navigate("/");
  };

  return (
    <button
      type="button"
      onClick={selectParkingLot}
      className="flex min-h-[60px] w-full items-center justify-between overflow-hidden rounded-lg border border-slate-100 bg-white px-3 py-2 text-left"
    >
      <span className="flex min-w-0 flex-col justify-center overflow-hidden">
        <DataText
          height={24}
          className="truncate text-base font-semibold leading-6 text-slate-800"
        >
          {lot.name}
        </DataText>
        <DataText
          height={20}
          className="truncate text-sm font-normal leading-5 text-slate-500"
        >
          {lot.address || "-"}
        </DataText>
      </span>

      <span className="ml-3 flex shrink-0 items-center gap-1.5">
        <span
          className={`rounded-full border-[1.5px] bg-white px-2 py-0.5 text-xs font-bold leading-4 ${meta.className}`}
        >
          {meta.label}
        </span>
        <DataText
          height={24}
          className="text-base font-medium leading-6 text-slate-600"
        >
          {used} / {lot.total_spaces}
        </DataText>
      </span>
    </button>
  );
};

const ParkingLotSkeletonRow = () => (
  <div className="flex min-h-[60px] w-full items-center justify-between overflow-hidden rounded-lg border border-slate-100 bg-white px-3 py-2 text-left">
    <span className="flex min-w-0 flex-1 flex-col justify-center gap-1 overflow-hidden">
      <Skeleton height={24} width="45%" />
      <Skeleton height={20} width="64%" />
    </span>
    <span className="ml-3 flex shrink-0 items-center gap-1.5">
      <Skeleton height={20} width={37} roundedClassName="rounded-full" />
      <Skeleton height={24} width={68} />
    </span>
  </div>
);

const SelectParkingLotContent = ({
  empty,
  onCreate,
  lots,
  loading,
  errorMessage,
}: {
  empty: boolean;
  onCreate: () => void;
  lots: LotOut[];
  loading: boolean;
  errorMessage?: string | null;
}) => (
  <main className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-2.5">
    <Panel className="min-h-[336px] max-w-[384px] rounded-md border-slate-200 p-3.5">
      <div className="flex min-h-[306px] flex-col gap-2">
        <CardTitle>주차장 선택</CardTitle>

        {loading ? (
          <div className="flex min-h-[232px] w-full flex-1 flex-col gap-2.5">
            {Array.from({ length: 3 }).map((_, index) => (
              <ParkingLotSkeletonRow key={index} />
            ))}
          </div>
        ) : errorMessage ? (
          <div className="flex min-h-[232px] w-full flex-1 items-center justify-center text-center text-sm font-normal leading-5 text-red-500">
            {errorMessage}
          </div>
        ) : empty ? (
          <div className="flex min-h-[232px] w-full flex-1 items-center justify-center text-center text-sm font-normal leading-5 text-slate-500">
            <p>
              선택 가능한 주차장이 없습니다.
              <br />새 주차장을 만들어 주세요.
            </p>
          </div>
        ) : (
          <div className="flex min-h-[232px] w-full flex-1 flex-col gap-2.5">
            {lots.map((lot) => (
              <ParkingLotRow key={lot.id} lot={lot} />
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={onCreate}
          className="flex h-10 w-full items-center justify-center gap-2.5 rounded-md border border-slate-100 bg-slate-50 p-2.5 text-sm font-medium leading-5 text-slate-600"
        >
          <Icon icon="lucide:plus" className="size-4" />
          새 주차장 만들기
        </button>
      </div>
    </Panel>
  </main>
);

const SelectParkingLotPage = () => {
  const [mode, setMode] = useState<"list" | "create">("list");
  const navigate = useNavigate();
  const lotsQuery = useListLotsApiV1LotsGet();
  const lots = lotsQuery.data ?? [];
  const loading = lotsQuery.isPending;
  const errorMessage = lotsQuery.isError
    ? getApiErrorMessage(lotsQuery.error, "주차장 목록을 불러오지 못했습니다.")
    : null;

  if (mode === "create") {
    return (
      <CreateParkingLotPage
        onCreated={(lot) => {
          setSelectedParkingLotId(lot.id);
          navigate("/");
        }}
      />
    );
  }

  return (
    <SelectParkingLotContent
      empty={!loading && lots.length === 0}
      lots={lots}
      loading={loading}
      errorMessage={errorMessage}
      onCreate={() => setMode("create")}
    />
  );
};

export default SelectParkingLotPage;
