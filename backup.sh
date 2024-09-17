#!/bin/bash

# Set home directory (홈 디렉토리 설정)
DATA_DIR="/data"
BACKUP_DIR="/backup"

# Set log file (로그 파일 설정)
LOG_FILE="$DATA_DIR/logs/db_backup.log"

# Record timestamp in log file (로그 파일에 시간 기록)
echo "Backup started at $(date)" >> "$LOG_FILE"

# Define backup function (백업 함수 정의)
backup_dir() {
    SRC_DIR="$1"  # Source directory to back up (백업할 소스 디렉토리)
    DEST_DIR="$2"  # Destination directory for backups (백업이 저장될 디렉토리)
    TIMESTAMP=$(date +"%Y%m%d")  # Use current date for file name (현재 날짜로 파일명 지정)
    BACKUP_FILE="$DEST_DIR/backup_$(basename "$SRC_DIR")_$TIMESTAMP.tar.gz"

    # Ensure the backup destination directory exists, create if not (백업 디렉토리 확인 및 생성)
    mkdir -p "$DEST_DIR"

    # Create the backup file (백업 파일 생성)
    tar -czf "$BACKUP_FILE" -C "$(dirname "$SRC_DIR")" "$(basename "$SRC_DIR")"
    echo "Backup created: $BACKUP_FILE" >> "$LOG_FILE"

    # Delete backup files older than 7 days, except those created on Mondays or the 1st of any month
    # 7일이 넘은 파일 중 월요일 또는 매월 1일에 생성된 파일은 삭제하지 않음
    find "$DEST_DIR" -name "backup_*.tar.gz" | while read -r file; do
        file_date=$(echo "$file" | sed -E 's/.*backup_.*_([0-9]{8}).tar.gz/\1/')
        file_day_of_week=$(date -d "$file_date" +%u)
        file_day_of_month=$(date -d "$file_date" +%d)

        # Skip files older than 7 days that were created on a Monday or on the 1st of the month
        # 7일이 지난 파일 중 월요일(요일=1)이나 1일(날짜=01)에 생성된 파일은 제외
        if [[ $(($(date +%s) - $(date -d "$file_date" +%s))) -gt 604800 && "$file_day_of_week" != 1 && "$file_day_of_month" != 01 ]]; then
            echo "Deleting: $file" >> "$LOG_FILE"
            rm -f "$file"
        fi
    done

    # Delete backup files older than 60 days, except those created on the 1st of any month
    # 60일이 넘은 파일 중 매월 1일에 생성된 파일은 삭제하지 않음
    find "$DEST_DIR" -name "backup_*.tar.gz" | while read -r file; do
        file_date=$(echo "$file" | sed -E 's/.*backup_.*_([0-9]{8}).tar.gz/\1/')
        file_day_of_month=$(date -d "$file_date" +%d)

        # Skip files older than 60 days that were created on the 1st of the month
        # 60일이 지난 파일 중 1일에 생성된 파일은 제외
        if [[ $(($(date +%s) - $(date -d "$file_date" +%s))) -gt 5184000 && "$file_day_of_month" != 01 ]]; then
            echo "Deleting: $file" >> "$LOG_FILE"
            rm -f "$file"
        fi
    done
}

# Set paths for backups (백업할 경로 설정)
backup_dir "$DATA_DIR/haio/db" "$BACKUP_DIR/backup/haio-db"  # Haio backup
backup_dir "$DATA_DIR/xrcloud/db" "$BACKUP_DIR/backup/xrcloud-db"  # XRCLOUD backup

# Record completion in log file (로그 파일에 백업 완료 기록)
echo "Backup completed at $(date)" >> "$LOG_FILE"
