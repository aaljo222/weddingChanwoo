// src/components/InvitationEdit.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FormatAll } from "./FormatAll";
import { Calendar } from "./Calendar";
import { FormSections } from "./FormSections";
import "../../css/InvitationAdd.css"; // 기존 ?��????�사??
import { loadInvList, saveInvList } from "../../utils/invStore";

const InvitationEdit = () => {
  const { ino } = useParams();
  const inoNum = useMemo(() => Number(ino), [ino]);
  const navigate = useNavigate();

  // ?�일 ?�스: 로컬?�토리�??�서 로드
  const [invData, setInvData] = useState(() => loadInvList());

  // ?�집 ?�??찾기 (??�� invData?�서 find)
  const existing = useMemo(
    () => invData.find((card) => card.ino === inoNum),
    [invData, inoNum]
  );

  useEffect(() => {
    if (!existing) navigate("/invitation-list");
  }, [existing, navigate]);

  // ???�태 (existing 기반 초기�?
  const [date, setDate] = useState(existing?.date || "2025-09-01");
  const [time, setTime] = useState(existing?.time || "12:00");
  const [groomName, setGroomName] = useState(existing?.groomName || "?�길??);
  const [brideName, setBrideName] = useState(existing?.brideName || "김?�희");
  const [bg, setBg] = useState(existing?.bg || "#FFFFFF");
  const [title1, setTitle1] = useState(
    existing?.title1 || "?�중??분들??초�??�니??
  );
  const [content, setContent] = useState(
    existing?.content ??
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

  // ?�???�데?�트)
  const handleUpdate = () => {
    setInvData((prev) => {
      const updatedData = (prev || []).map((card) =>
        card.ino === inoNum
          ? { ...card, date, time, groomName, brideName, bg, title1, content }
          : card
      );
      saveInvList(updatedData);
      return updatedData;
    });
    navigate("/InvitationList");
  };

  if (!existing) return null; // 짧�? 가??

  return (
    <div className="invitation-edit ie-page">
      {/* ?�쪽: 미리보기 */}
      <div className="preview-pane ie-preview">
        <div className="phone-frame" aria-label="모바??�?��??미리보기">
          <div className="phone-notch" aria-hidden="true" />
          <div
            className="phone-canvas"
            style={{ ["--preview-bg"]: bg }} // CSS 변??지??
          >
            <div className="phone-scroll">
              {/* ?�단 ?�짜/?�일 */}
              <div className="section section--tight text-center">
                <h2 className="meta meta--upper">{fmt.dateSlash}</h2>
                <h2 className="meta meta--upper">{fmt.weekdayUpperEn}</h2>
              </div>

              {/* ?�랑/?��? ?�름 */}
              <p className="names">
                <span className="name">{groomName}</span>
                <span className="dot">·</span>
                <span className="name">{brideName}</span>
              </p>

              {/* ?�국???�짜/?�간 */}
              <div className="text-center">
                <h2 className="meta">{fmt.koDateTimeFull}</h2>
              </div>

              {/* 구분??*/}
              <div className="divider" aria-hidden="true" />

              {/* ?�사�?*/}
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
          <h2 className="form-title">�?��???�보 ?�집</h2>
          <p className="form-sub">
            ?�른쪽을 ?�정?�면 ?�쪽 미리보기??즉시 반영?�니??
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
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleUpdate}
          >
            ?�정?�기
          </button>
          <Link to="/InvitationList" className="btn btn-ghost">
            목록?�로
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InvitationEdit;
