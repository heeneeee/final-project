import React from 'react';
import Calendar from 'react-calendar';
import St from './style';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { QUERY_KEYS } from '../../query/keys';
import { getMyPosts } from '../../api/myPostAPI';
import { useQuery } from '@tanstack/react-query';
import habitSticker from '../../assets/habitSticker.png';
import { getFormattedDateCustom } from '../../util/formattedDateAndTime';
type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const HabitCalendar = ({ date }: any) => {
  // 초기값은 현재 날짜
  const [today, setToday] = useState<Value>(new Date());
  //클릭한 캘린더의 날짜를 알려줌
  const moment = require('moment');
  const onChangeToday = () => {
    setToday(today);
  };

  // post 작성 날짜 가져와서 state에 담기
  const [mark, setMark] = useState([]);

  const { data } = useQuery({
    queryKey: [QUERY_KEYS.POSTS],
    queryFn: getMyPosts
  });
  const createdAtList = data ? data.map((data) => getFormattedDateCustom(data.createdAt!)) : [];
  const dayList = [
    //테스트용
    '2023. 12. 12.',
    '2023. 12. 25.',
    '2024. 01. 01.',
    '2024. 01. 05.',
    '2024. 01. 07.',
    '2024. 01. 12.'
  ];
  console.log('포스트의 날짜 목록 가져오기', createdAtList);

  // const dayList = ['2024-01-01', '2024-01-04', '2024-01-05', '2024-01-09', '2024-01-11'];
  // // 각 날짜 타일에 컨텐츠 추가
  // // const addContent = ({ date }: any) => {
  //   // 해당 날짜(하루)에 추가할 컨텐츠의 배열
  //   const contents = [];

  //   // date(각 날짜)가  리스트의 날짜와 일치하면 해당 컨텐츠(이모티콘) 추가
  //   if (dayList.find((day) => day === moment(date).format('YYYY-MM-DD'))) {
  //     contents.push(
  //       <React.Fragment >
  //         <img key={date} src={habitSticker} width="26" height="26" />
  //       </React.Fragment>
  //     );
  //   }
  // };

  return (
    <St.CalendarWrapper>
      <St.StyleCalendar>
        <St.CalendarTitle>CALENDAR</St.CalendarTitle>
        <Calendar
          onChange={onChangeToday}
          value={today}
          // eng 버전
          locale="en"
          // 일요일부터 시작
          calendarType="gregory"
          tileContent={({ date, view }) => {
            const formattedDate = moment(date).format('YYYY. MM. DD');
            if (dayList.find((x) => x === moment(date).format('YYYY. MM. DD.'))) {
              return (
                <>
                  <div className="habitDayContainer" key={formattedDate}></div>
                  <img
                    key={formattedDate}
                    className="habitImage"
                    src={habitSticker}
                    alt={`habit-sticker-${formattedDate}`}
                  />
                  {/* <div className="habitDate">{moment(date).format('DD')}</div> */}
                </>
              );
            }
            return null;
          }}
        />
        현재 날짜 {moment(date).format('YYYY년 MM월 DD일')}
      </St.StyleCalendar>
    </St.CalendarWrapper>
  );
};

export default HabitCalendar;
