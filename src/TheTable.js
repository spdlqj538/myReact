import React, { useState, useRef, useMemo } from "react";

//학점 계산
function setGrade(score) {
  if (score >= 92) {
    return "A+";
  } else if (score === 91) {
    return "A0";
  } else if (score >= 85) {
    return "B+";
  } else if (score >= 80) {
    return "B0";
  } else if (score >= 75) {
    return "C+";
  } else if (score >= 70) {
    return "C0";
  } else if (score >= 65) {
    return "D+";
  } else if (score >= 60) {
    return "D0";
  }

  return "F";
}

// 오름차순 정렬
function compareRows(a, b) {
  if (a.course !== b.course) {
    return a.course.localeCompare(b.course);
  }
  if (a.type !== b.type) {
    return a.type.localeCompare(b.type);
  }
  return a.subTitle.localeCompare(b.subTitle);
}

function TheTable({ grade }) {
  const rowID = useRef(0); // 행의 고유 ID
  const [rows, setRows] = useState([]); // 행들의 배열
  const hasGradeRows = useMemo(
    // 행들 중 성적 입력이 완료되고 학점이 1이 아닌 배열
    () => rows.filter((row) => row.grade !== "" && row.credit !== 1),
    [rows]
  );

  const [deleteRows, setDeleteRows] = useState([]); // 삭제 예정인 행들의 배열

  // 정렬
  function handleSort() {
    setRows((rows) => [...rows].sort(compareRows));
  }
  // 행 추가
  function handleAddRow() {
    setRows((rows) => [
      ...rows,
      {
        id: rowID.current,
        course: "교양",
        type: "필수",
        subTitle: "",
        credit: 0,
        attScore: 0,
        assScore: 0,
        midterm: 0,
        final: 0,
        subTotalScore: 0,
        grade: "",
      },
    ]);

    rowID.current++;
  }

  // 행 저장
  function handleSave() {
    const hasNotGradeRows = rows.filter((row) => row.grade === "");

    if (hasNotGradeRows.length < 1) {
      alert("성적을 입력할 행을 추가해주세요");
      return;
    }

    if (hasNotGradeRows.filter((row) => row.subTitle === "").length > 0) {
      alert("과목명을 입력해주세요");
      return;
    }

    if (hasNotGradeRows.filter((row) => row.credit === 0).length > 0) {
      alert("학점을 입력해주세요");
      return;
    }

    setRows((rows) =>
      rows.map((item) => {
        const { credit, attScore, assScore, midterm, final, grade } = item;

        if (grade === "") {
          // 계산이 수행되지 않는 행만 계산
          item.subTotalScore = attScore + assScore + midterm + final;
          if (credit === 1) {
            // 학점이 1이면 P로 고정
            item.grade = "P";
          } else {
            item.grade = setGrade(item.subTotalScore);
          }
        }

        return item;
      })
    );
    handleSort();
  }

  // 삭제할 행 추가
  function handleAddDeleteRow(id) {
    if (deleteRows.includes(id)) {
      setDeleteRows((deleteRows) => deleteRows.filter((_id) => _id !== id));
    } else {
      setDeleteRows((deleteRows) => [...deleteRows, id]);
    }
  }

  // 행 삭제
  function handleDeleteRow() {
    if (deleteRows.length < 1) {
      alert("삭제할 행을 선택해주세요");
      return;
    }

    setRows((rows) => rows.filter((row) => !deleteRows.includes(row.id)));
    setDeleteRows([]);
  }

  // set 이수
  function handleSetCourse(event, index) {
    const { value } = event.target;

    setRows((rows) =>
      rows.map((row, _index) =>
        _index === index ? { ...row, course: value } : row
      )
    );
  }

  // set 필수 or 전공
  function handleSetType(event, index) {
    const { value } = event.target;

    setRows((rows) =>
      rows.map((row, _index) =>
        _index === index ? { ...row, type: value } : row
      )
    );
  }

  // set 과목명
  function handleSetSubTitle(event, index) {
    const { value } = event.target;
    const isDuplicate = rows.some(
      (row, _index) => _index !== index && row.subTitle === value
    );

    if (isDuplicate) {
      alert("이미 등록된 과목입니다. 다른 과목을 입력해주세요.");
      return;
    }

    setRows((rows) =>
      rows.map((row, _index) =>
        _index === index ? { ...row, subTitle: value } : row
      )
    );
  }

  // set 학점
  function handleSetCredit(event, index) {
    let { value } = event.target;
    value = Number(value) || 0;

    setRows((rows) =>
      rows.map((row, _index) =>
        _index === index ? { ...row, credit: value } : row
      )
    );
  }

  // set 출석점수
  function handleSetAttScore(event, index) {
    let { value } = event.target;
    value = Number(value) || 0;

    if (value < 0 || value > 20) {
      alert("출석 점수는 0 ~ 20점 사이의 숫자만 입력해주세요.");
      return;
    }

    setRows((rows) =>
      rows.map((row, _index) =>
        _index === index ? { ...row, attScore: value } : row
      )
    );
  }

  // set 과제점수
  function handleSetAssScore(event, index) {
    let { value } = event.target;
    value = Number(value) || 0;

    if (value < 0 || value > 20) {
      alert("과제 점수는 0 ~ 20점 사이의 숫자만 입력해주세요.");
      return;
    }

    setRows((rows) =>
      rows.map((row, _index) =>
        _index === index ? { ...row, assScore: value } : row
      )
    );
  }

  // set 중간고사
  function handleSetMidterm(event, index) {
    let { value } = event.target;
    value = Number(value) || 0;

    if (value < 0 || value > 30) {
      alert("중간고사 점수는 0 ~ 30점 사이의 숫자만 입력해주세요.");
      return;
    }

    setRows((rows) =>
      rows.map((row, _index) =>
        _index === index ? { ...row, midterm: value } : row
      )
    );
  }

  // set 기말고사
  function handleSetFinal(event, index) {
    let { value } = event.target;
    value = Number(value) || 0;

    if (value < 0 || value > 30) {
      alert("기말고사 점수는 0 ~ 30점 사이의 숫자만 입력해주세요.");
      return;
    }

    setRows((rows) =>
      rows.map((row, _index) =>
        _index === index ? { ...row, final: value } : row
      )
    );
  }

  return (
    <div>
      <h1>{grade}학년</h1>
      <button onClick={handleAddRow}>추가</button>
      <button onClick={handleDeleteRow}>삭제</button>
      <button onClick={handleSave}>저장</button>

      <table width={1000} border={1}>
        <thead style={{ backgroundColor: "#00796B", color: "#ffffff" }}>
          <tr>
            <th>이수</th>
            <th>필수</th>
            <th>과목명</th>
            <th>학점</th>
            <th>출석점수</th>
            <th>과제점수</th>
            <th>중간고사</th>
            <th>기말고사</th>
            <th>총점</th>
            <th>평균</th>
            <th>성적</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) =>
            row.grade === "" ? (
              <tr key={row.id}>
                <td>
                  <select
                    value={row.course}
                    onChange={(event) => handleSetCourse(event, index)}
                  >
                    <option defaultValue="교양">교양</option>
                    <option defaultValue="전공">전공</option>
                  </select>
                </td>
                <td>
                  <select
                    value={row.type}
                    onChange={(event) => handleSetType(event, index)}
                  >
                    <option defaultValue="필수">필수</option>
                    <option defaultValue="선택">선택</option>
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    name="subTitle"
                    value={row.subTitle}
                    onInput={(event) => handleSetSubTitle(event, index)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="credit"
                    value={row.credit}
                    style={{ width: 45 + "px" }}
                    onInput={(event) => handleSetCredit(event, index)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="attScore"
                    value={row.attScore}
                    style={{ width: 45 + "px" }}
                    onInput={(event) => handleSetAttScore(event, index)}
                    disabled={row.credit === 1}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="assScore"
                    value={row.assScore}
                    style={{ width: 45 + "px" }}
                    onInput={(event) => handleSetAssScore(event, index)}
                    disabled={row.credit === 1}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="midterm"
                    value={row.midterm}
                    style={{ width: 45 + "px" }}
                    onInput={(event) => handleSetMidterm(event, index)}
                    disabled={row.credit === 1}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="final"
                    value={row.final}
                    style={{ width: 45 + "px" }}
                    onInput={(event) => handleSetFinal(event, index)}
                    disabled={row.credit === 1}
                  />
                </td>
                <td className="subTotalScore">{row.subTotalScore}</td>
                <td></td>
                <td className="grade">{row.grade}</td>
              </tr>
            ) : (
              <tr
                key={row.id}
                className={deleteRows.includes(row.id) ? "delete" : ""}
                onClick={() => handleAddDeleteRow(row.id)}
              >
                <td>{row.course}</td>
                <td>{row.type}</td>
                <td>{row.subTitle}</td>
                <td>{row.credit}</td>
                <td>{row.attScore}</td>
                <td>{row.assScore}</td>
                <td>{row.midterm}</td>
                <td>{row.final}</td>
                <td className="subTotalScore"></td>
                <td></td>
                <td className="grade">{row.grade}</td>
              </tr>
            )
          )}
        </tbody>
        <tfoot>
          {rows.length > 0 ? (
            <tr>
              <td colSpan={3}>합계</td>
              <td className="sumCredit">
                {hasGradeRows.reduce(
                  (acc, cur) => (cur.credit > 1 ? acc + cur.credit : acc),
                  0
                )}
              </td>
              <td className="sumAttScore">
                {hasGradeRows.reduce((acc, cur) => acc + cur.attScore, 0)}
              </td>
              <td className="sumAssScore">
                {hasGradeRows.reduce((acc, cur) => acc + cur.assScore, 0)}
              </td>
              <td className="sumMidterm">
                {hasGradeRows.reduce((acc, cur) => acc + cur.midterm, 0)}
              </td>
              <td className="sumFinal">
                {hasGradeRows.reduce((acc, cur) => acc + cur.final, 0)}
              </td>
              <td className="totalScore">
                {hasGradeRows.reduce((acc, cur) => acc + cur.subTotalScore, 0)}
              </td>
              <td className="avg">
                {hasGradeRows.length > 0
                  ? (
                      hasGradeRows.reduce(
                        (acc, cur) => acc + cur.subTotalScore,
                        0
                      ) / hasGradeRows.length
                    ).toFixed(1)
                  : 0}
              </td>
              <td
                className="finalGrade"
                style={{
                  color: hasGradeRows.some((row) => row.grade === "F")
                    ? "red"
                    : "inherit",
                }}
              >
                {hasGradeRows.length > 0
                  ? setGrade(
                      hasGradeRows.reduce(
                        (acc, cur) => acc + cur.subTotalScore,
                        0
                      ) / hasGradeRows.length
                    )
                  : ""}
              </td>
            </tr>
          ) : null}
        </tfoot>
      </table>
    </div>
  );
}

export default TheTable;
