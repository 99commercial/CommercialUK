'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  Paper,
  Typography,
  TextField,
  InputAdornment,
} from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import PersonIcon from '@mui/icons-material/Person';
import Image from 'next/image';
import axiosInstance from '../utils/axios';

// Call backend AI chat endpoint (OpenRouter proxy) for a real response
const getAIResponse = async (
  userMessage: string,
  history: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> => {
  try {
    const payload = {
      messages:
        history && history.length
          ? history
          : [
              {
                role: 'user' as const,
                content: userMessage,
              },
            ],
    };

    const res = await axiosInstance.post('/api/aical/chat', payload, {
      timeout: 20000,
    });

    const reply: string =
      (res.data && (res.data.reply as string)) ||
      'Sorry, I was unable to generate a response. Please try again.';

    return reply;
  } catch (error: any) {
    // Surface a friendly error but also let caller handle generic fallback text
    console.error('LivePageChatWidget AI error:', error?.response?.data || error?.message || error);
    throw error;
  }
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export default function LivePageChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hi! I\'m your CommercialUK assistant. Ask me about commercial property, listings, or how to use the platform.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const reply = await getAIResponse(text, [
        ...messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        { role: 'user', content: text },
      ]);
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again or contact support@commercialuk.com.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating logo button - bottom right */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1300,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 1,
        }}
      >
        {open && (
          <Paper
            elevation={8}
            sx={{
              width: { xs: 'calc(100vw - 48px)', sm: 380 },
              maxWidth: 380,
              height: 480,
              maxHeight: 'calc(100vh - 120px)',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 3,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box
              sx={{
                py: 1.5,
                px: 2,
                backgroundColor: '#1a1a1a',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SmartToyRoundedIcon sx={{ fontSize: 24 }} />
                <Typography variant="subtitle1" fontWeight={600}>
                  AI Assistant
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={() => setOpen(false)}
                sx={{ color: 'inherit' }}
                aria-label="Close chat"
              >
                <CloseRoundedIcon />
              </IconButton>
            </Box>

            <Box
              sx={{
                flex: 1,
                overflow: 'auto',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                backgroundColor: '#fafafa',
              }}
            >
              {messages.map((msg) => (
                <Box
                  key={msg.id}
                  sx={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    alignItems: 'flex-start',
                    gap: 1,
                  }}
                >
                  {msg.role === 'assistant' && (
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        backgroundColor: '#f2c514',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <SmartToyRoundedIcon sx={{ fontSize: 16, color: '#1a1a1a' }} />
                    </Box>
                  )}
                  <Paper
                    variant="outlined"
                    sx={{
                      px: 2,
                      py: 1.5,
                      maxWidth: '85%',
                      backgroundColor: msg.role === 'user' ? '#1a1a1a' : '#fff',
                      color: msg.role === 'user' ? '#fff' : 'text.primary',
                      borderRadius: 2,
                      borderColor: msg.role === 'user' ? 'transparent' : 'divider',
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {msg.content}
                    </Typography>
                  </Paper>
                  {msg.role === 'user' && (
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        backgroundColor: '#e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 16, color: '#666' }} />
                    </Box>
                  )}
                </Box>
              ))}
              {loading && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, alignSelf: 'flex-start' }}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      backgroundColor: '#f2c514',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <SmartToyRoundedIcon sx={{ fontSize: 16, color: '#1a1a1a' }} />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Thinking...
                  </Typography>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>

            <Box sx={{ p: 1.5, borderTop: 1, borderColor: 'divider', backgroundColor: '#fff' }}>
              <TextField
                inputRef={inputRef}
                fullWidth
                size="small"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        color="primary"
                        onClick={sendMessage}
                        disabled={!input.trim() || loading}
                        aria-label="Send message"
                        sx={{ backgroundColor: '#f2c514', color: '#1a1a1a', '&:hover': { backgroundColor: '#e6b813' }, '&.Mui-disabled': { backgroundColor: '#e5e7eb', color: '#9ca3af' } }}
                      >
                        <SendRoundedIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2, backgroundColor: '#f9fafb' },
                }}
              />
            </Box>
          </Paper>
        )}

        <IconButton
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close chatbot' : 'Open chatbot'}
          sx={{
            width: 64,
            height: 64,
            backgroundColor: '#1a1a1a',
            color: '#f2c514',
            border: '3px solid #f2c514',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            '&:hover': {
              backgroundColor: '#2d2d2d',
              transform: 'scale(1.05)',
              boxShadow: '0 6px 24px rgba(0,0,0,0.25)',
            },
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
        >
          {open ? (
            <CloseRoundedIcon sx={{ fontSize: 28 }} />
          ) : (
            <Box
              component="span"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 1,
                overflow: 'hidden',
                backgroundColor: '#fff',
              }}
            >
              <Image
                src="/images/CUKLogo.png"
                alt="CommercialUK"
                width={40}
                height={40}
                style={{ objectFit: 'contain' }}
              />
            </Box>
          )}
        </IconButton>
      </Box>
    </>
  );
}
