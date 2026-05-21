export type ParkingLot = {
  id: string;
  name: string;
  address: string;
  used: number;
  capacity: number;
};

export type ParkedCar = {
  id: string;
  enteredAgo: string;
  plate: string;
  parkedTime: string;
  fee: string;
};

export type ParkingLog = {
  id: string;
  type: "enterance" | "exit";
  timeAgo: string;
  plate: string;
  parkedTime: string;
  paidFee: string;
};

export const mockParkingLots: ParkingLot[] = [
  {
    id: "a",
    name: "A주차장",
    address: "경북대학교 북문 앞",
    used: 50,
    capacity: 100,
  },
  {
    id: "b",
    name: "B주차장",
    address: "경북대학교 본관 옆",
    used: 60,
    capacity: 85,
  },
  {
    id: "c",
    name: "C주차장",
    address: "경북대학교 정문 교차로 근처",
    used: 57,
    capacity: 62,
  },
];

export const mockParkedCars: ParkedCar[] = [
  {
    id: "car-1",
    enteredAgo: "1분 전",
    plate: "12가 4982",
    parkedTime: "00:01",
    fee: "2,000",
  },
  {
    id: "car-2",
    enteredAgo: "15분 전",
    plate: "12가 4985",
    parkedTime: "00:15",
    fee: "3,500",
  },
  {
    id: "car-3",
    enteredAgo: "20분 전",
    plate: "12가 4986",
    parkedTime: "00:20",
    fee: "4,000",
  },
  {
    id: "car-4",
    enteredAgo: "1시간 전",
    plate: "12가 4987",
    parkedTime: "01:33",
    fee: "4,500",
  },
  {
    id: "car-5",
    enteredAgo: "2일 전",
    plate: "12가 4988",
    parkedTime: "2:06:12",
    fee: "5,000",
  },
];

export const mockParkingLogs: ParkingLog[] = [
  {
    id: "log-1",
    type: "enterance",
    timeAgo: "1분 전",
    plate: "12가 4982",
    parkedTime: "00:01",
    paidFee: "-",
  },
  {
    id: "log-2",
    type: "enterance",
    timeAgo: "5분 전",
    plate: "34가 7854",
    parkedTime: "00:05",
    paidFee: "-",
  },
  {
    id: "log-3",
    type: "exit",
    timeAgo: "10분 전",
    plate: "21가 3467",
    parkedTime: "00:10",
    paidFee: "1,200",
  },
  {
    id: "log-4",
    type: "exit",
    timeAgo: "15분 전",
    plate: "45가 9087",
    parkedTime: "00:15",
    paidFee: "3,000",
  },
  {
    id: "log-5",
    type: "enterance",
    timeAgo: "20분 전",
    plate: "18가 5674",
    parkedTime: "00:20",
    paidFee: "-",
  },
];

