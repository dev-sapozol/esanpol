"use client"

import styles from "../compose/ComposeModal.module.css"

interface AttachmentsListProps {
  attachments: File[]
  onRemove: (index: number) => void
}

const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function AttachmentsList({ attachments, onRemove }: AttachmentsListProps) {
  if (attachments.length === 0) return null

  return (
    <div className={styles.attachmentsList}>
      {attachments.map((file, i) => (
        <div key={`${file.name}-${i}`} className={styles.attachmentChip}>
          <div className={styles.fileIcon}>📄</div>
          <div className={styles.fileInfo}>
            <span className={styles.fileName} title={file.name}>
              {file.name}
            </span>
            <span className={styles.fileSize}>{formatSize(file.size)}</span>
          </div>
          <button
            onClick={() => onRemove(i)}
            aria-label={`Eliminar adjunto ${file.name}`}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}