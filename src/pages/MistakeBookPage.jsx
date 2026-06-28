import { useState } from "react";
import Card from "../components/Card.jsx";
import DeleteConfirmModal from "../components/DeleteConfirmModal.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { clearMistakes, getProgress, removeMistake } from "../lib/storage.js";
import { normalizeAnswer } from "../utils/learning/scoringStrategies.js";

function groupMistakes(mistakes) {
  return (Array.isArray(mistakes) ? mistakes : []).reduce((groups, mistake) => {
    const type = mistake?.type || "practice";
    return {
      ...groups,
      [type]: [...(groups[type] || []), mistake],
    };
  }, {});
}

const secondaryButtonClass =
  "h-10 rounded-xl border border-loot-border bg-loot-card px-4 text-sm font-medium text-loot-text transition-colors hover:bg-loot-selected";
const ghostButtonClass =
  "h-10 rounded-xl px-4 text-sm font-medium text-loot-muted transition-colors hover:bg-loot-selected";

export default function MistakeBookPage() {
  const [progress, setProgress] = useState(() => getProgress());
  const [retryId, setRetryId] = useState("");
  const [retryAnswers, setRetryAnswers] = useState({});
  const [retryResults, setRetryResults] = useState({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const mistakeGroups = groupMistakes(progress.mistakes);
  const groupEntries = Object.entries(mistakeGroups);

  function handleRemove(mistakeId) {
    setProgress(removeMistake(mistakeId));
  }

  function handleClear() {
    setIsDeleteModalOpen(true);
  }

  function handleConfirmClear() {
    setProgress(clearMistakes());
    setRetryId("");
    setRetryAnswers({});
    setRetryResults({});
    setIsDeleteModalOpen(false);
  }

  function handleRetryCheck(mistake) {
    const answer = retryAnswers[mistake.id] || "";
    const isCorrect = normalizeAnswer(answer) === normalizeAnswer(mistake.target);

    setRetryResults((current) => ({
      ...current,
      [mistake.id]: isCorrect
        ? "Đúng rồi. Bạn có thể xóa lỗi này khi sẵn sàng."
        : "Chưa đúng. Thử lại chậm hơn nhé.",
    }));
  }

  return (
    <>
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <PageHeader
          eyebrow="Mistake Book"
          title="Sổ lỗi cá nhân"
          description="Ôn lại lỗi nghe, Real Talk, Gamer Comms, từ vựng, và ngữ pháp khi cần."
        />
        {progress.mistakes.length > 0 ? (
          <button
            className={ghostButtonClass}
            type="button"
            onClick={handleClear}
          >
            Xóa tất cả
          </button>
        ) : null}
      </div>

      {groupEntries.length > 0 ? (
        <div className="space-y-4">
          {groupEntries.map(([type, mistakes]) => (
            <Card key={type} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-base font-medium text-loot-text">{type}</h3>
                <span className="rounded-[40px] border border-loot-border bg-loot-selected px-3 py-1 text-sm font-normal text-loot-muted">
                  {mistakes.length} lỗi đã lưu
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {mistakes.map((mistake) => (
                  <div
                    key={mistake.id}
                    className="rounded-[20px] border border-loot-border bg-loot-selected p-4"
                  >
                    <p className="text-sm font-medium text-loot-text">
                      {mistake.target}
                    </p>
                    {mistake.userAnswer ? (
                      <p className="mt-2 text-sm font-normal leading-6 text-loot-muted">
                        Bạn đã trả lời: {mistake.userAnswer}
                      </p>
                    ) : null}

                    {retryId === mistake.id ? (
                      <div className="mt-4">
                        <input
                          className="h-10 w-full rounded-xl border border-loot-border bg-loot-card px-3 text-sm font-normal text-loot-text outline-none focus:bg-loot-selected"
                          placeholder="Gõ đáp án đúng..."
                          value={retryAnswers[mistake.id] || ""}
                          onChange={(event) =>
                            setRetryAnswers((current) => ({
                              ...current,
                              [mistake.id]: event.target.value,
                            }))
                          }
                        />
                        {retryResults[mistake.id] ? (
                          <p className="mt-2 text-sm font-medium leading-6 text-loot-text">
                            {retryResults[mistake.id]}
                          </p>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        className={secondaryButtonClass}
                        type="button"
                        onClick={() =>
                          setRetryId(retryId === mistake.id ? "" : mistake.id)
                        }
                      >
                        Luyện lại
                      </button>
                      {retryId === mistake.id ? (
                        <button
                          className={secondaryButtonClass}
                          type="button"
                          onClick={() => handleRetryCheck(mistake)}
                        >
                          Kiểm tra lại
                        </button>
                      ) : null}
                      <button
                        className={ghostButtonClass}
                        type="button"
                        onClick={() => handleRemove(mistake.id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <p className="text-sm font-normal leading-6 text-loot-muted">
            Chưa có lỗi nào. Câu quiz hoặc câu nghe trả lời sai sẽ hiện ở đây để
            ôn lại.
          </p>
        </Card>
      )}

      <DeleteConfirmModal
        description="Hành động này không thể hoàn tác."
        isOpen={isDeleteModalOpen}
        title="Xóa tất cả lỗi?"
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmClear}
      />
    </>
  );
}
