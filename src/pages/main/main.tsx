import { Icon } from "@iconify/react";
import type { ReactNode } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  DataText,
  Field,
  Logo,
  ModalBackdrop,
  Panel,
} from "../../components/openpark/ui";
import {
  mockParkedCars,
  mockParkingLogs,
  type ParkedCar,
  type ParkingLog,
} from "../../components/openpark/mockData";

const isMainLoading = false;

const tableHeaderClass =
  "grid w-full gap-1 rounded-lg bg-slate-50 p-2 text-xs font-semibold leading-4 text-slate-500";

const rowClass =
  "grid min-h-8 w-full items-center gap-1 rounded-lg border border-slate-100 bg-white px-2 py-1.5 text-xs font-medium leading-4 text-slate-900";

const popupMenuItemClass =
  "flex w-full cursor-pointer items-center gap-2.5 rounded p-1 text-sm font-medium leading-5 text-slate-800 hover:bg-slate-50";

const Header = ({
  onMenuClick,
  onMenuClose,
  menuOpen,
  onCamera,
  onEdit,
}: {
  onMenuClick: () => void;
  onMenuClose: () => void;
  menuOpen: boolean;
  onCamera: () => void;
  onEdit: () => void;
}) => {
  const navigate = useNavigate();

  return (
    <header className="relative flex h-6 w-full items-start justify-between">
      <div className="flex items-end justify-center gap-2.5">
        <Logo compact />
        <DataText
          loading={isMainLoading}
          height={20}
          className="text-sm font-medium leading-5 text-slate-500"
        >
          A주차장
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
                onClick={() => navigate("/login")}
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

const MoreButton = () => (
  <button
    type="button"
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
  car: ParkedCar;
  onExit: (car: ParkedCar) => void;
}) => (
  <div className={`${rowClass} grid-cols-[repeat(4,minmax(0,1fr))_48px]`}>
    <DataText loading={isMainLoading} height={16}>
      {car.enteredAgo}
    </DataText>
    <DataText loading={isMainLoading} height={16}>
      {car.plate}
    </DataText>
    <DataText loading={isMainLoading} height={16}>
      {car.parkedTime}
    </DataText>
    <DataText loading={isMainLoading} height={16}>
      {car.fee}
    </DataText>
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

const LogStatus = ({ type }: { type: ParkingLog["type"] }) => {
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

const ParkingLogRow = ({ log }: { log: ParkingLog }) => (
  <div className={`${rowClass} grid-cols-5`}>
    <span className="min-w-0 overflow-hidden">
      <LogStatus type={log.type} />
    </span>
    <DataText loading={isMainLoading} height={16}>
      {log.timeAgo}
    </DataText>
    <DataText loading={isMainLoading} height={16}>
      {log.plate}
    </DataText>
    <DataText loading={isMainLoading} height={16}>
      {log.parkedTime}
    </DataText>
    <DataText loading={isMainLoading} height={16}>
      {log.paidFee}
    </DataText>
  </div>
);

const MainCard = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <Panel className="flex min-h-0 flex-1 flex-col gap-2 rounded-xl border-slate-200 p-3.5">
    <h2 className="text-sm font-medium leading-5 text-slate-600">{title}</h2>
    {children}
  </Panel>
);

const ParkedCarsTable = ({
  cars,
  onExit,
}: {
  cars: ParkedCar[];
  onExit: (car: ParkedCar) => void;
}) => (
  <MainCard title="주차장 현황 (40/120)">
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

      {cars.length > 0 ? (
        <>
          <div className="flex min-h-0 flex-1 flex-col gap-1.5">
            {cars.map((car) => (
              <ParkedCarRow key={car.id} car={car} onExit={onExit} />
            ))}
          </div>
          <MoreButton />
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
  onCamera,
}: {
  logs: ParkingLog[];
  onCamera: () => void;
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

      {logs.length > 0 ? (
        <>
          <div className="mt-2 flex min-h-0 flex-1 flex-col gap-2">
            {logs.map((log) => (
              <ParkingLogRow key={log.id} log={log} />
            ))}
          </div>
          <MoreButton />
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
  onClose,
}: {
  car: ParkedCar;
  onClose: () => void;
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
            주차 시간 : 12:30
            <br />
            현재 요금 : 3,000
          </p>
        </div>
        <Button tone="danger" className="w-full" onClick={onClose}>
          출차하기
        </Button>
      </div>
    </Panel>
  </ModalBackdrop>
);

const CameraModal = ({ onClose }: { onClose: () => void }) => (
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
              <span className="font-medium text-blue-500">README.md</span>에 따라
              카메라 클라이언트를 준비한다.
            </p>
            <p className="flex items-center gap-0.5 font-medium">
              <Icon icon="lucide:chevron-right" className="size-4" />
              <Icon icon="mdi:github" className="size-4" />
              KNU-2026S-OSP-TEAM01/Client
            </p>
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
              <Icon
                icon="ci:copy"
                className="absolute right-3 top-3 size-4 text-slate-500"
              />
              <p>
                <span className="font-normal">url: </span>
                <span className="font-medium">https://your-backend-url.com/</span>
              </p>
              <p>
                <span className="font-normal">api_key: </span>
                <span className="font-medium">
                  a20c8614-e2b2-4b22-8bd2-28eba368f2af
                </span>
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

const EditFeeToggle = () => (
  <button
    type="button"
    className="flex h-6 w-14 items-center justify-between overflow-hidden rounded-full bg-slate-300 p-1 text-white"
  >
    <span className="size-4 rounded-full bg-white" />
    <span className="text-xs font-black leading-4">OFF</span>
  </button>
);

const EditParkingLotModal = ({ onClose }: { onClose: () => void }) => (
  <ModalBackdrop onClose={onClose}>
    <Panel className="min-h-[336px] max-w-[384px] rounded-md border-0 p-3.5 shadow-[0_0_16px_4px_rgba(0,0,0,0.25)]">
      <form
        className="flex flex-col gap-2.5"
        onSubmit={(event) => {
          event.preventDefault();
          onClose();
        }}
      >
        <h2 className="text-sm font-semibold leading-5 text-slate-500">
          주차장 수정
        </h2>
        <div className="flex min-h-[232px] w-full flex-col justify-center gap-2.5">
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
            <EditFeeToggle />
          </div>
        </div>
        <Button type="submit" className="w-full">
          수정하기
        </Button>
      </form>
    </Panel>
  </ModalBackdrop>
);

const MainPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [exitCar, setExitCar] = useState<ParkedCar | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [emptyMode] = useState(false);
  const cars = emptyMode ? [] : mockParkedCars;
  const logs = emptyMode ? [] : mockParkingLogs;

  const openCamera = () => {
    setMenuOpen(false);
    setCameraOpen(true);
  };

  const openEdit = () => {
    setMenuOpen(false);
    setEditOpen(true);
  };

  return (
    <main className="flex min-h-screen w-full flex-col gap-4 bg-slate-50 p-8">
      <Header
        menuOpen={menuOpen}
        onMenuClick={() => setMenuOpen((value) => !value)}
        onMenuClose={() => setMenuOpen(false)}
        onCamera={openCamera}
        onEdit={openEdit}
      />
      <ParkedCarsTable cars={cars} onExit={setExitCar} />
      <ParkingLogsTable logs={logs} onCamera={openCamera} />
      {exitCar ? <ExitModal car={exitCar} onClose={() => setExitCar(null)} /> : null}
      {cameraOpen ? <CameraModal onClose={() => setCameraOpen(false)} /> : null}
      {editOpen ? <EditParkingLotModal onClose={() => setEditOpen(false)} /> : null}
    </main>
  );
};

export default MainPage;
