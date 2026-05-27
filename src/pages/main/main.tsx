import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getGetLotApiV1LotsLotIdGetQueryKey,
  getListLogsApiV1LotsLotIdLogsGetQueryKey,
  getListVehiclesApiV1LotsLotIdVehiclesGetQueryKey,
  type LogOut,
  type LotOut,
  type VehicleOut,
  useForceExitVehicleApiV1LotsLotIdVehiclesVehicleIdDelete,
  useGetLotApiV1LotsLotIdGet,
  useListLogsApiV1LotsLotIdLogsGet,
  useListVehiclesApiV1LotsLotIdVehiclesGet,
  useUpdateLotApiV1LotsLotIdPatch,
} from "../../api/generated";
import {
  Button,
  DataText,
  Field,
  Logo,
  ModalBackdrop,
  Panel,
} from "../../components/openpark/ui";
import Skeleton from "../../components/ui/Skeleton";
import { apiBaseURL } from "../../services/api";
import { getApiErrorMessage } from "../../services/apiError";
import {
  clearSelectedParkingLotId,
  getSelectedParkingLotId,
} from "../../services/parkingLotSelection";

type DisplayVehicle = {
  id: string;
  enteredAgo: string;
  plate: string;
  parkedTime: string;
  fee: string;
};

type DisplayLog = {
  id: string;
  type: "entry" | "exit";
  timeAgo: string;
  plate: string;
  parkedTime: string;
  paidFee: string;
};

const tableHeaderClass =
  "grid w-full gap-1 rounded-lg bg-slate-50 p-2 text-xs font-semibold leading-4 text-slate-500";

const rowClass =
  "grid min-h-8 w-full items-center gap-1 rounded-lg border border-slate-100 bg-white px-2 py-1.5 text-xs font-medium leading-4 text-slate-900";

const CAMERA_CLIENT_REPOSITORY_URL =
  "https://github.com/KNU-2026S-OSP-TEAM01/Client";

const popupMenuItemClass =
  "flex w-full cursor-pointer items-center gap-2.5 rounded p-1 text-sm font-medium leading-5 text-slate-800 hover:bg-slate-50";

const toNumber = (value: string) => Number(value.replaceAll(",", ""));

const formatCurrency = (value: number | null | undefined) => {
  if (value == null) return "-";
  return value.toLocaleString("ko-KR");
};

const getDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getDurationMinutes = (from: string) => {
  const date = getDate(from);
  if (!date) return 0;

  return Math.max(0, Math.ceil((Date.now() - date.getTime()) / 60000));
};

const formatRelativeTime = (value: string) => {
  const minutes = getDurationMinutes(value);

  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;

  return `${Math.floor(hours / 24)}일 전`;
};

const formatParkedTime = (value: string) => {
  const totalMinutes = getDurationMinutes(value);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

const calculateFee = (lot: LotOut | undefined, enteredAt: string) => {
  if (!lot) return 0;

  const duration = getDurationMinutes(enteredAt);
  const baseDuration = lot.base_duration_minutes || 0;
  const extraUnit = lot.extra_fee_unit_minutes || 1;
  const extraMinutes = Math.max(0, duration - baseDuration);
  const extraUnits = Math.ceil(extraMinutes / extraUnit);
  const fee = lot.base_fee + extraUnits * lot.extra_fee_per_unit;

  return lot.daily_max_fee == null ? fee : Math.min(fee, lot.daily_max_fee);
};

const toDisplayVehicle = (
  vehicle: VehicleOut,
  lot: LotOut | undefined
): DisplayVehicle => ({
  id: vehicle.id,
  enteredAgo: formatRelativeTime(vehicle.entered_at),
  plate: vehicle.plate,
  parkedTime: formatParkedTime(vehicle.entered_at),
  fee: formatCurrency(calculateFee(lot, vehicle.entered_at)),
});

const toDisplayLog = (log: LogOut): DisplayLog => {
  const isExit = log.event_type.toLowerCase().includes("exit");

  return {
    id: log.id,
    type: isExit ? "exit" : "entry",
    timeAgo: formatRelativeTime(log.server_received_at),
    plate: log.plate,
    parkedTime: "-",
    paidFee: formatCurrency(log.fee),
  };
};

const invalidateMainQueries = (queryClient: ReturnType<typeof useQueryClient>, lotId: string) => {
  queryClient.invalidateQueries({
    queryKey: getGetLotApiV1LotsLotIdGetQueryKey(lotId),
  });
  queryClient.invalidateQueries({
    queryKey: getListVehiclesApiV1LotsLotIdVehiclesGetQueryKey(lotId),
  });
  queryClient.invalidateQueries({
    queryKey: getListLogsApiV1LotsLotIdLogsGetQueryKey(lotId),
  });
};

const Header = ({
  lotName,
  loading,
  onMenuClick,
  onMenuClose,
  menuOpen,
  onCamera,
  onEdit,
  onLogout,
}: {
  lotName?: string;
  loading: boolean;
  onMenuClick: () => void;
  onMenuClose: () => void;
  menuOpen: boolean;
  onCamera: () => void;
  onEdit: () => void;
  onLogout: () => void;
}) => {
  const navigate = useNavigate();

  return (
    <header className="relative flex h-6 w-full items-start justify-between">
      <div className="flex items-end justify-center gap-2.5">
        <Logo compact />
        <DataText
          loading={loading}
          height={20}
          className="text-sm font-medium leading-5 text-slate-500"
        >
          {lotName || "-"}
        </DataText>
      </div>
      <button
        type="button"
        onClick={onMenuClick}
        className="flex size-6 items-center justify-center text-slate-600"
        aria-label="메뉴"
      >
        <Icon icon="lucide:menu" className="size-6" />
      </button>

      {menuOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-10 cursor-default bg-transparent"
            aria-label="팝업 닫기"
            onClick={onMenuClose}
          />
          <div className="absolute right-0 top-[26px] z-20 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_4px_16px_4px_rgba(0,0,0,0.1)]">
            <div className="flex flex-col p-2">
              <button
                type="button"
                onClick={onCamera}
                className={popupMenuItemClass}
              >
                <Icon icon="lucide:camera" className="size-4" />
                카메라 연결 하기
              </button>
              <button
                type="button"
                onClick={onEdit}
                className={popupMenuItemClass}
              >
                <Icon icon="lucide:edit" className="size-4" />
                주차장 수정하기
              </button>
              <button
                type="button"
                onClick={() => navigate("/select")}
                className={popupMenuItemClass}
              >
                <Icon icon="lucide:arrow-left" className="size-4" />
                주차장 선택으로 돌아가기
              </button>
              <button
                type="button"
                onClick={onLogout}
                className={popupMenuItemClass}
              >
                <Icon icon="lucide:log-out" className="size-4" />
                로그아웃
              </button>
            </div>
          </div>
        </>
      ) : null}
    </header>
  );
};

const MoreButton = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-10 w-full items-center justify-center gap-2.5 bg-slate-50 p-2.5 text-sm font-medium leading-5 text-slate-600"
  >
    <Icon icon="lucide:chevron-down" className="size-4" />
    더 보기
  </button>
);

const ParkedCarRow = ({
  car,
  onExit,
}: {
  car: DisplayVehicle;
  onExit: (car: DisplayVehicle) => void;
}) => (
  <div className={`${rowClass} grid-cols-[repeat(4,minmax(0,1fr))_48px]`}>
    <DataText height={16}>{car.enteredAgo}</DataText>
    <DataText height={16}>{car.plate}</DataText>
    <DataText height={16}>{car.parkedTime}</DataText>
    <DataText height={16}>{car.fee}</DataText>
    <button
      type="button"
      onClick={() => onExit(car)}
      className="flex w-12 items-center text-slate-600"
      aria-label={`${car.plate} 수동 출차`}
    >
      <Icon icon="lets-icons:remove-fill" className="size-6" />
    </button>
  </div>
);

const ParkedCarSkeletonRow = () => (
  <div className={`${rowClass} grid-cols-[repeat(4,minmax(0,1fr))_48px]`}>
    <Skeleton height={16} width="40%" />
    <Skeleton height={16} width="48%" />
    <Skeleton height={16} width="32%" />
    <Skeleton height={16} width="32%" />
    <span className="w-12" />
  </div>
);

const LogStatus = ({ type }: { type: DisplayLog["type"] }) => {
  const isExit = type === "exit";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-1 py-0.5 text-xs font-semibold leading-4 ${
        isExit ? "bg-red-50 text-red-500" : "bg-green-50 text-green-500"
      }`}
    >
      <Icon
        icon={
          isExit
            ? "lucide:square-arrow-right-exit"
            : "lucide:square-arrow-right-enter"
        }
        className="size-4"
      />
      {isExit ? "출차" : "입차"}
    </span>
  );
};

const ParkingLogRow = ({ log }: { log: DisplayLog }) => (
  <div className={`${rowClass} grid-cols-5`}>
    <span className="min-w-0 overflow-hidden">
      <LogStatus type={log.type} />
    </span>
    <DataText height={16}>{log.timeAgo}</DataText>
    <DataText height={16}>{log.plate}</DataText>
    <DataText height={16}>{log.parkedTime}</DataText>
    <DataText height={16}>{log.paidFee}</DataText>
  </div>
);

const ParkingLogSkeletonRow = () => (
  <div className={`${rowClass} grid-cols-5`}>
    <Skeleton height={20} width={49} roundedClassName="rounded" />
    <Skeleton height={16} width="38%" />
    <Skeleton height={16} width="48%" />
    <Skeleton height={16} width="32%" />
    <Skeleton height={16} width="32%" />
  </div>
);

const MainCard = ({
  title,
  children,
}: {
  title: ReactNode;
  children: ReactNode;
}) => (
  <Panel className="flex min-h-0 flex-1 flex-col gap-2 rounded-xl border-slate-200 p-3.5">
    <h2 className="flex items-center gap-1 text-sm font-medium leading-5 text-slate-600">
      {title}
    </h2>
    {children}
  </Panel>
);

const ParkingStatusTitle = ({
  lot,
  loading,
}: {
  lot?: LotOut;
  loading: boolean;
}) => (
  <>
    <span>주차장 현황 (</span>
    {loading ? (
      <Skeleton height={20} width={64} />
    ) : (
      <span>
        {lot ? lot.total_spaces - lot.available_spaces : 0} /{" "}
        {lot?.total_spaces ?? 0}
      </span>
    )}
    <span>)</span>
  </>
);

const ParkedCarsTable = ({
  cars,
  loading,
  lot,
  onExit,
  onMore,
  hasMore,
}: {
  cars: DisplayVehicle[];
  loading: boolean;
  lot?: LotOut;
  onExit: (car: DisplayVehicle) => void;
  onMore: () => void;
  hasMore: boolean;
}) => (
  <MainCard title={<ParkingStatusTitle lot={lot} loading={loading} />}>
    <div className="flex min-h-0 flex-1 flex-col gap-1.5">
      <div
        className={`${tableHeaderClass} grid-cols-[repeat(4,minmax(0,1fr))_48px]`}
      >
        <span>출입 시간</span>
        <span>차량 번호</span>
        <span>주차 시간</span>
        <span>현재 요금</span>
        <span>수동 출차</span>
      </div>

      {loading ? (
        <div className="flex min-h-0 flex-1 flex-col gap-1.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <ParkedCarSkeletonRow key={index} />
          ))}
        </div>
      ) : cars.length > 0 ? (
        <>
          <div className="flex min-h-0 flex-1 flex-col gap-1.5">
            {cars.map((car) => (
              <ParkedCarRow key={car.id} car={car} onExit={onExit} />
            ))}
          </div>
          {hasMore ? <MoreButton onClick={onMore} /> : null}
        </>
      ) : (
        <div className="flex min-h-0 flex-1 items-center justify-center p-2.5 text-sm font-normal leading-5 text-slate-800">
          주차된 차량이 없습니다.
        </div>
      )}
    </div>
  </MainCard>
);

const ParkingLogsTable = ({
  logs,
  loading,
  onCamera,
  onMore,
  hasMore,
}: {
  logs: DisplayLog[];
  loading: boolean;
  onCamera: () => void;
  onMore: () => void;
  hasMore: boolean;
}) => (
  <MainCard title="입·출차 현황">
    <div className="flex min-h-0 flex-1 flex-col gap-0">
      <div className={`${tableHeaderClass} grid-cols-5`}>
        <span>입·출차</span>
        <span>시간</span>
        <span>차량 번호</span>
        <span>주차 시간</span>
        <span>낸 요금</span>
      </div>

      {loading ? (
        <div className="mt-2 flex min-h-0 flex-1 flex-col gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <ParkingLogSkeletonRow key={index} />
          ))}
        </div>
      ) : logs.length > 0 ? (
        <>
          <div className="mt-2 flex min-h-0 flex-1 flex-col gap-2">
            {logs.map((log) => (
              <ParkingLogRow key={log.id} log={log} />
            ))}
          </div>
          {hasMore ? <MoreButton onClick={onMore} /> : null}
        </>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2.5 p-2.5 text-center">
          <p className="text-sm font-normal leading-5 text-slate-800">
            입·출차 현황이 없습니다.
            <br />
            카메라를 연결해 주세요.
          </p>
          <Button className="w-32" onClick={onCamera}>
            연결하기
          </Button>
        </div>
      )}
    </div>
  </MainCard>
);

const ExitModal = ({
  car,
  pending,
  errorMessage,
  onClose,
  onConfirm,
}: {
  car: DisplayVehicle;
  pending: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onConfirm: () => void;
}) => (
  <ModalBackdrop onClose={onClose}>
    <Panel className="min-h-[336px] max-w-[384px] rounded-md border-0 p-3.5 shadow-[0_0_16px_4px_rgba(0,0,0,0.25)]">
      <div className="flex min-h-[308px] flex-col gap-2.5">
        <h2 className="text-sm font-semibold leading-5 text-slate-500">
          출차 확인
        </h2>
        <div className="flex min-h-[232px] flex-1 flex-col items-center justify-center gap-2 overflow-hidden text-center text-sm leading-5 text-slate-800">
          <p>
            <span className="font-medium">{car.plate}</span>
            {" 차량을 출차합니다. 이 행동은 되돌릴 수 없습니다."}
            <br />
            진행하시겠습니까?
          </p>
          <p className="font-medium">
            주차 시간 : {car.parkedTime}
            <br />
            현재 요금 : {car.fee}
          </p>
          {errorMessage ? (
            <p className="text-xs font-medium leading-4 text-red-500">
              {errorMessage}
            </p>
          ) : null}
        </div>
        <Button
          tone="danger"
          className="w-full disabled:cursor-not-allowed disabled:bg-slate-300"
          onClick={onConfirm}
          disabled={pending}
        >
          {pending ? "출차 중..." : "출차하기"}
        </Button>
      </div>
    </Panel>
  </ModalBackdrop>
);

const CameraModal = ({
  lot,
  loading,
  onClose,
}: {
  lot?: LotOut;
  loading: boolean;
  onClose: () => void;
}) => {
  const [copyBubbleVisible, setCopyBubbleVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const fadeTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(
    null
  );
  const hideTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(
    null
  );

  useEffect(
    () => () => {
      if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    },
    []
  );

  const copyConfig = async () => {
    if (!lot) return;

    await navigator.clipboard?.writeText(
      `url: ${apiBaseURL}\napi_key: ${lot.api_key}`
    );
    if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);

    setCopyBubbleVisible(true);
    setCopied(true);
    fadeTimerRef.current = window.setTimeout(() => setCopied(false), 900);
    hideTimerRef.current = window.setTimeout(
      () => setCopyBubbleVisible(false),
      1150
    );
  };

  return (
    <ModalBackdrop onClose={onClose}>
      <Panel className="max-w-[393px] rounded-md border-0 p-3.5 shadow-[0_0_16px_4px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col gap-2.5">
          <h2 className="text-sm font-semibold leading-5 text-slate-500">
            카메라 연결
          </h2>
          <div className="flex flex-col gap-3 text-sm leading-5 text-slate-800">
            <section className="flex flex-col gap-1">
              <h3 className="font-medium">1. 카메라 클라이언트 준비</h3>
              <p className="font-normal">
                PC 또는 라즈베리파이 환경에서 다음 리포지토리의{" "}
                <a
                  href={CAMERA_CLIENT_REPOSITORY_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-blue-500 hover:underline"
                >
                  README.md
                </a>
                에
                따라 카메라 클라이언트를 준비한다.
              </p>
              <a
                href={CAMERA_CLIENT_REPOSITORY_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-0.5 font-medium text-slate-800 hover:text-blue-500 hover:underline"
              >
                <Icon icon="lucide:chevron-right" className="size-4" />
                <Icon icon="mdi:github" className="size-4" />
                KNU-2026S-OSP-TEAM01/Client
              </a>
            </section>

            <section className="flex flex-col gap-1">
              <h3 className="font-medium">2. 환경변수 설정</h3>
              <p className="font-normal">
                서버와의 연결을 위해{" "}
                <code className="rounded bg-slate-50 px-1 font-mono text-red-500">
                  config/client.yaml
                </code>
                에 다음 값을 넣는다.
              </p>
              <div className="relative flex flex-col gap-1 rounded-lg bg-slate-100 px-3.5 py-4 text-slate-900">
                <button
                  type="button"
                  onClick={copyConfig}
                  disabled={loading || !lot}
                  className="absolute right-3 top-3 text-slate-500 disabled:cursor-not-allowed disabled:text-slate-300"
                  aria-label="카메라 설정 복사"
                >
                  <Icon icon="ci:copy" className="size-4" />
                </button>
                {copyBubbleVisible ? (
                  <span
                    className={`pointer-events-none absolute right-0 top-[-38px] inline-flex items-center gap-1 whitespace-nowrap rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold leading-4 text-slate-700 shadow-[0_6px_18px_rgba(15,23,42,0.12)] transition-all duration-200 ease-out ${
                      copied
                        ? "translate-y-0 opacity-100"
                        : "translate-y-1 opacity-0"
                    }`}
                  >
                    <Icon icon="lucide:check" className="size-3.5 text-blue-500" />
                    복사 완료
                  </span>
                ) : null}
                <p className="flex min-w-0 gap-1">
                  <span className="font-normal">url: </span>
                  {loading ? (
                    <Skeleton height={20} width={195} />
                  ) : (
                    <span className="truncate font-medium">{apiBaseURL}</span>
                  )}
                </p>
                <p className="flex min-w-0 gap-1">
                  <span className="shrink-0 font-normal">api_key: </span>
                  {loading ? (
                    <Skeleton height={20} width={282} />
                  ) : (
                    <span className="truncate font-medium">
                      {lot?.api_key || "-"}
                    </span>
                  )}
                </p>
              </div>
            </section>

            <section className="flex flex-col gap-1">
              <h3 className="font-medium">3. 연결 테스트</h3>
              <p className="font-normal">
                웹캠 또는 라즈베리파이 카메라를 사용하여 번호판을 인식시켜
                정상적으로 인식 및 차량 등록을 확인한다.
              </p>
            </section>
          </div>
          <Button className="w-full" onClick={onClose}>
            확인
          </Button>
        </div>
      </Panel>
    </ModalBackdrop>
  );
};

const EditFeeToggle = ({
  enabled,
  onClick,
}: {
  enabled: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={enabled}
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

const EditParkingLotModal = ({
  lot,
  onClose,
}: {
  lot: LotOut;
  onClose: () => void;
}) => {
  const queryClient = useQueryClient();
  const [feeEnabled, setFeeEnabled] = useState(
    lot.base_fee > 0 ||
      lot.base_duration_minutes > 0 ||
      lot.extra_fee_per_unit > 0 ||
      lot.extra_fee_unit_minutes > 0
  );
  const [name, setName] = useState(lot.name);
  const [address, setAddress] = useState(lot.address || "");
  const [totalSpaces, setTotalSpaces] = useState(String(lot.total_spaces));
  const [baseFee, setBaseFee] = useState(String(lot.base_fee));
  const [baseDurationMinutes, setBaseDurationMinutes] = useState(
    String(lot.base_duration_minutes)
  );
  const [extraFeePerUnit, setExtraFeePerUnit] = useState(
    String(lot.extra_fee_per_unit)
  );
  const [extraFeeUnitMinutes, setExtraFeeUnitMinutes] = useState(
    String(lot.extra_fee_unit_minutes)
  );
  const [formError, setFormError] = useState<string | null>(null);
  const updateLotMutation = useUpdateLotApiV1LotsLotIdPatch({
    mutation: {
      onSuccess: () => {
        invalidateMainQueries(queryClient, lot.id);
        onClose();
      },
      onError: (error) => {
        setFormError(
          getApiErrorMessage(error, "주차장 정보를 수정하지 못했습니다.")
        );
      },
    },
  });

  const submitUpdate = () => {
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

    const patch = {
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
        : {
            base_fee: null,
            base_duration_minutes: null,
            extra_fee_per_unit: null,
            extra_fee_unit_minutes: null,
          }),
    };

    updateLotMutation.mutate({ lotId: lot.id, data: patch });
  };

  return (
    <ModalBackdrop onClose={onClose}>
      <Panel className="min-h-[336px] max-w-[384px] rounded-md border-0 p-3.5 shadow-[0_0_16px_4px_rgba(0,0,0,0.25)]">
        <form
          className="flex flex-col gap-2.5"
          autoComplete="off"
          onSubmit={(event) => {
            event.preventDefault();
            submitUpdate();
          }}
        >
          <h2 className="text-sm font-semibold leading-5 text-slate-500">
            주차장 수정
          </h2>
          <div className="flex min-h-[232px] w-full flex-col justify-center gap-2.5">
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
              <EditFeeToggle
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
                  required
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
                  required
                />
                <Field
                  label="추가 요금"
                  placeholder="추가 요금 입력"
                  inputMode="numeric"
                  icon="uil:sort"
                  value={extraFeePerUnit}
                  onChange={(event) => setExtraFeePerUnit(event.target.value)}
                  autoComplete="off"
                  required
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
                  required
                />
              </>
            ) : null}
          </div>
          {formError ? (
            <p className="text-xs font-medium leading-4 text-red-500">
              {formError}
            </p>
          ) : null}
          <Button
            type="submit"
            className="w-full disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={updateLotMutation.isPending}
          >
            {updateLotMutation.isPending ? "수정 중..." : "수정하기"}
          </Button>
        </form>
      </Panel>
    </ModalBackdrop>
  );
};

const MainPage = () => {
  const [selectedLotId] = useState(getSelectedParkingLotId);
  const [menuOpen, setMenuOpen] = useState(false);
  const [exitCar, setExitCar] = useState<DisplayVehicle | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [vehicleVisibleCount, setVehicleVisibleCount] = useState(5);
  const [logLimit, setLogLimit] = useState(5);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!selectedLotId) {
      navigate("/select", { replace: true });
    }
  }, [navigate, selectedLotId]);

  const lotId = selectedLotId ?? "";
  const queryEnabled = Boolean(selectedLotId);
  const lotQuery = useGetLotApiV1LotsLotIdGet(lotId, {
    query: { enabled: queryEnabled },
  });
  const vehiclesQuery = useListVehiclesApiV1LotsLotIdVehiclesGet(lotId, {
    query: { enabled: queryEnabled },
  });
  const logsQuery = useListLogsApiV1LotsLotIdLogsGet(
    lotId,
    { limit: logLimit },
    { query: { enabled: queryEnabled } }
  );
  const forceExitMutation =
    useForceExitVehicleApiV1LotsLotIdVehiclesVehicleIdDelete({
      mutation: {
        onSuccess: () => {
          invalidateMainQueries(queryClient, lotId);
          setExitCar(null);
        },
      },
    });

  const lot = lotQuery.data;
  const allCars = (vehiclesQuery.data ?? []).map((vehicle) =>
    toDisplayVehicle(vehicle, lot)
  );
  const cars = allCars.slice(0, vehicleVisibleCount);
  const logs = (logsQuery.data ?? []).map(toDisplayLog);
  const loadingLot = lotQuery.isPending;
  const loadingVehicles = lotQuery.isPending || vehiclesQuery.isPending;
  const loadingLogs = logsQuery.isPending;
  const errorMessage =
    lotQuery.isError || vehiclesQuery.isError || logsQuery.isError
      ? getApiErrorMessage(
          lotQuery.error ?? vehiclesQuery.error ?? logsQuery.error,
          "주차장 정보를 불러오지 못했습니다."
        )
      : null;
  const exitErrorMessage = forceExitMutation.isError
    ? getApiErrorMessage(forceExitMutation.error, "출차 요청을 처리하지 못했습니다.")
    : null;

  const openCamera = () => {
    setMenuOpen(false);
    setCameraOpen(true);
  };

  const openEdit = () => {
    setMenuOpen(false);
    setEditOpen(true);
  };

  const logout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    clearSelectedParkingLotId();
    navigate("/login", { replace: true });
  };

  const confirmForceExit = () => {
    if (!exitCar || !selectedLotId) return;

    forceExitMutation.mutate({
      lotId: selectedLotId,
      vehicleId: exitCar.id,
    });
  };

  if (!selectedLotId) return null;

  return (
    <main className="flex min-h-screen w-full flex-col gap-4 bg-slate-50 p-8">
      <Header
        lotName={lot?.name}
        loading={loadingLot}
        menuOpen={menuOpen}
        onMenuClick={() => setMenuOpen((value) => !value)}
        onMenuClose={() => setMenuOpen(false)}
        onCamera={openCamera}
        onEdit={openEdit}
        onLogout={logout}
      />
      {errorMessage ? (
        <Panel className="rounded-xl border-red-100 p-3.5 text-sm font-medium leading-5 text-red-500">
          {errorMessage}
        </Panel>
      ) : null}
      <ParkedCarsTable
        cars={cars}
        loading={loadingVehicles}
        lot={lot}
        onExit={setExitCar}
        hasMore={allCars.length > vehicleVisibleCount}
        onMore={() => setVehicleVisibleCount((count) => count + 5)}
      />
      <ParkingLogsTable
        logs={logs}
        loading={loadingLogs}
        onCamera={openCamera}
        hasMore={logs.length >= logLimit}
        onMore={() => setLogLimit((limit) => limit + 5)}
      />
      {exitCar ? (
        <ExitModal
          car={exitCar}
          pending={forceExitMutation.isPending}
          errorMessage={exitErrorMessage}
          onClose={() => setExitCar(null)}
          onConfirm={confirmForceExit}
        />
      ) : null}
      {cameraOpen ? (
        <CameraModal
          lot={lot}
          loading={loadingLot}
          onClose={() => setCameraOpen(false)}
        />
      ) : null}
      {editOpen && lot ? (
        <EditParkingLotModal lot={lot} onClose={() => setEditOpen(false)} />
      ) : null}
    </main>
  );
};

export default MainPage;
