// src/ChallengeModal.jsx
import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, LinearProgress
} from '@mui/material';
import Editor from '@monaco-editor/react';
import axios from 'axios';

export default function ChallengeModal({ idx, status, onClose }) {
  // 더미 챌린지 데이터 (나중에 API로 불러올 예정)
  const dummy = {
    title: `챌린지 #${idx + 1}`,
    description: '여기에 문제 설명이 들어갑니다.',
  };

  const [code, setCode] = useState('// 여기에 코드를 작성하세요');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setMessage(null);
    try {
      // 예: /api/challenges/{idx}/submit 엔드포인트로 POST
      const res = await axios.post(`/api/challenges/${idx}/submit`, {
        code,
      });
      setMessage('제출 성공! 상태가 업데이트되었습니다.');
    } catch (err) {
      setMessage(err.response?.data?.message || '제출 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{dummy.title}</DialogTitle>
      <DialogContent dividers>
        <p>{dummy.description}</p>
        <div style={{ height: '400px', marginTop: 16 }}>
          <Editor
            height="100%"
            defaultLanguage="javascript"
            defaultValue={code}
            onChange={(value) => setCode(value)}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
            }}
          />
        </div>
        {loading && <LinearProgress style={{ marginTop: 8 }} />}
        {message && (
          <p style={{ marginTop: 8, color: loading ? 'inherit' : 'limegreen' }}>
            {message}
          </p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>닫기</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
        >
          제출하기
        </Button>
      </DialogActions>
    </Dialog>
  );
}
