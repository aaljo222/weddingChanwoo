// src/components/InvitationAdd.jsx
import React, { useMemo, useState } from "react";
import { Calendar } from "./Calendar";
import "../../css/InvitationAdd.css";
import { Link, useNavigate } from "react-router-dom";
import { loadInvList, saveInvList } from "../../utils/invStore";
import { FormSections } from "./FormSections";
import { FormatAll } from "./FormatAll";

/* ================= 메인: InvitationAdd ================= */
export default function InvitationAdd() {
  const navigate = useNavigate();

  // 1) ?�일 ?�스: 로컬?�토리�??�서 기존 리스??로드
  const [invData, setInvData] = useState(() => loadInvList());

  // 2) ?�규 카드??ino 계산 (?�재 invData 기�?)
  const nextIno = useMemo(() => {
    if (Array.isArray(invData) && invData.length > 0) {
      const maxIno = Math.max(...invData.map(({ ino }) => ino || 0));
      return maxIno + 1;
    }
    return 1;
  }, [invData]);

  // 3) ?�규 카드 ?�력 ?�태
  const [ino] = useState(nextIno);
  const [date, setDate] = useState("2025-09-01");
  const [time, setTime] = useState("12:00");
  const [groomName, setGroomName] = useState("?�길??);
  const [brideName, setBrideName] = useState("김?�희");
  const [bg, setBg] = useState("#FFFFFF");
  const [title1, setTitle1] = useState("?�중??분들??초�??�니??);
  const [content, setContent] = useState(
    `?�?????�람???��? 만남??

?�랑??결실???�루??

?�중??결혼?�을 ?�리�??�었?�니??

?�생 ?�로 귀?�게 ?�기�?
�?마음 그�?�?존중?�고 배려?�며 ?�겠?�니??

?�로지 믿음�??�랑???�속?�는 ??
?�셔??축복??주시�????�는 기쁨?�로
간직?�겠?�니??`
  );

  const fmt = FormatAll(date, time);

  // 4) 추�? ?�들?? 로컬 ?�태 + 로컬?�토리�????�????목록?�로 ?�동
  const handleAdd = () => {
    const newItem = {
      ino,
      date,
      time,
      groomName,
      brideName,
      bg,
      title1,
      content,
    };
    const addedData = [...(invData || []), newItem];
    setInvData(addedData);
    saveInvList(addedData);
    navigate("/invitation-list");
  };

  return (
    <div className="invitation-edit ie-page">
      {/* ?�쪽: 미리보기 */}
      <div key={ino} className="preview-pane ie-preview">
        <div className="phone-frame" aria-label="모바??�?��??미리보기">
          <div className="phone-notch" aria-hidden="true" />
          <div
            className="phone-canvas"
            style={{ ["--preview-bg"]: bg }} // CSS 변???�전 지??
          >
            <div className="phone-scroll">
              {/* ?�단 ?�짜/?�일 */}
              <div className="section section--tight text-center">
                <h2 className="meta meta--upper">{fmt.dateSlash}</h2>
                <h2 className="meta meta--upper">{fmt.weekdayUpperEn}</h2>
              </div>

              {/* ?�름 */}
              <p className="names">
                <span className="name">{groomName}</span>
                <span className="dot">·</span>
                <span className="name">{brideName}</span>
              </p>

              {/* ?�국???�짜/?�간 ?�맷 */}
              <div className="text-center">
                <h2 className="meta">{fmt.koDateTimeFull}</h2>
              </div>

              {/* 구분??*/}
              <div className="divider" aria-hidden="true" />

              {/* ?�개/본문 */}
              <div className="intro">
                <p className="intro__tag">INVITATION</p>
                <p className="intro__title">{title1}</p>
                <p className="intro__body">{content}</p>
              </div>

              {/* ?�단 ?�맷 */}
              <div className="section text-center">
                <h2 className="meta meta--upper">{fmt.dateDot}</h2>
                <h2 className="meta">{fmt.koDateTimeTail}</h2>
              </div>

              {/* ?�력 */}
              <div className="section section--calendar">
                <Calendar value={date} onChange={setDate} />
              </div>
            </div>
          </div>
          <div className="phone-homebar" aria-hidden="true" />
        </div>
      </div>

      {/* ?�른�? ?�력 ??*/}
      <div className="form-pane ie-form">
        <header className="form-header">
          <h2 className="form-title">�?��???�보 ?�력</h2>
          <p className="form-sub">
            ?�용???�력?�면 ?�쪽 미리보기??즉시 반영?�니??
          </p>
        </header>

        <FormSections
          // ?�마
          bg={bg}
          setBg={setBg}
          // 기본 ?�보
          date={date}
          setDate={setDate}
          time={time}
          setTime={setTime}
          groomName={groomName}
          setGroomName={setGroomName}
          brideName={brideName}
          setBrideName={setBrideName}
          // ?�사�?
          title1={title1}
          setTitle1={setTitle1}
          content={content}
          setContent={setContent}
        />

        <div className="sticky-actions">
          <button type="button" className="btn btn-primary" onClick={handleAdd}>
            추�??�기
          </button>
          <Link to="/InvitationList" className="btn btn-ghost">
            목록?�로
          </Link>
        </div>
      </div>
    </div>
  );
}
