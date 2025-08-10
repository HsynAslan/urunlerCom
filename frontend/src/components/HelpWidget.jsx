import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  useTheme,
  useMediaQuery,
  Box,
  Fab,
  Paper,
  Typography,
  IconButton,
  Divider,
  Button,
  Zoom,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CloseIcon from "@mui/icons-material/Close";
import { keyframes } from "@mui/system";

export default function HelpWidget({ pageKey }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [open, setOpen] = useState(false);
  const [selectedQ, setSelectedQ] = useState(null);
  const [showSteps, setShowSteps] = useState(false);
  const [shake, setShake] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const faqList = t(`${pageKey}.faq`, { returnObjects: true }) || [];
  const contactPrompt = t(`${pageKey}.contactPrompt`) || "";
  const steps = t(`${pageKey}.steps`, { returnObjects: true }) || [];

  useEffect(() => {
    const interval = setInterval(() => {
      if (!open) {
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [open]);

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => setShowHint(true), 10000);
      return () => clearTimeout(timer);
    } else {
      setShowHint(false);
    }
  }, [open]);

  const shakeAnim = keyframes`
    0% { transform: translate(0, 0) rotate(0deg); }
    20% { transform: translate(-2px, 0) rotate(-2deg); }
    40% { transform: translate(2px, 0) rotate(2deg); }
    60% { transform: translate(-2px, 0) rotate(-2deg); }
    80% { transform: translate(2px, 0) rotate(2deg); }
    100% { transform: translate(0, 0) rotate(0deg); }
  `;

  const handleFabClick = () => {
    setOpen(true);
    setShowHint(false);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedQ(null);
    setShowSteps(false);
  };

  return (
    <>
      {/* FAB + Help Hint */}
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 3000,
          display: "flex",
          alignItems: "center",
          gap: 1,
          pointerEvents: "auto",
        }}
      >
        {showHint && (
          <Paper
            elevation={4}
            sx={{
              p: 1,
              bgcolor: "background.paper",
              borderRadius: 2,
              fontSize: "0.85rem",
              maxWidth: 180,
              cursor: "pointer",
              userSelect: "none",
              boxShadow: theme.shadows[6],
              transition: "transform 0.2s ease",
              "&:hover": {
                bgcolor: "primary.light",
                color: "white",
                transform: "scale(1.05)",
              },
            }}
            onClick={handleFabClick}
            role="button"
            aria-label={t(`${pageKey}.helpHint`, "Need help?")}
          >
            {t(`${pageKey}.helpHint`, "Need help?")}
          </Paper>
        )}

        <Fab
          color="primary"
          onClick={handleFabClick}
          sx={{
            animation: shake ? `${shakeAnim} 0.5s` : "none",
            boxShadow: theme.shadows[6],
          }}
          aria-label={t(`${pageKey}.openHelp`, "Open Help")}
        >
          <HelpOutlineIcon />
        </Fab>
      </Box>

      {/* Help Panel */}
      <Zoom in={open}>
        <Box
          sx={{
            position: "fixed",
            bottom: isMobile ? 0 : 80,
            right: isMobile ? 0 : 80,
            width: isMobile ? "100%" : 380,
            maxHeight: isMobile ? "100%" : "85vh",
            bgcolor: "background.paper",
            borderRadius: isMobile ? 0 : 3,
            boxShadow: 8,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            zIndex: 4000,
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="help-dialog-title"
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              bgcolor: theme.palette.primary.main,
              color: "#fff",
              userSelect: "none",
            }}
          >
            <Typography variant="h6" id="help-dialog-title" noWrap>
              {t(`${pageKey}.helpTitle`, "Help")}
            </Typography>
            <IconButton
              size="small"
              onClick={handleClose}
              sx={{ color: "#fff" }}
              aria-label={t(`${pageKey}.close`, "Close")}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* How To + FAQ Buttons */}
          <Box sx={{ p: 2, overflowY: "auto", flex: 1 }}>
            {!selectedQ && !showSteps && (
              <Stack spacing={1}>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    justifyContent: "flex-start",
                    textTransform: "none",
                    fontWeight: "medium",
                    borderRadius: 2,
                  }}
                  onClick={() => setShowSteps(true)}
                  aria-expanded={showSteps}
                  aria-controls="howto-list"
                >
                  {t(`${pageKey}.howTo`, "How To")}
                </Button>

                {faqList.map((item, i) => (
                  <Button
                    key={i}
                    fullWidth
                    variant="outlined"
                    sx={{
                      justifyContent: "flex-start",
                      textAlign: "left",
                      borderRadius: 2,
                      fontWeight: "medium",
                      textTransform: "none",
                      color: "text.primary",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                    onClick={() => setSelectedQ(item)}
                    aria-label={item.q}
                  >
                    {item.q}
                  </Button>
                ))}
              </Stack>
            )}

            {/* How To List */}
            {showSteps && !selectedQ && (
              <Box
                id="howto-list"
                role="region"
                aria-label={t(`${pageKey}.howTo`, "How To")}
              >
                <Button
                  size="small"
                  onClick={() => setShowSteps(false)}
                  sx={{ mb: 1 }}
                  aria-label={t(`${pageKey}.backToHelp`, "Back to Help")}
                >
                   {t(`${pageKey}.backToHelp`, "Back to Help")}
                </Button>
                <ol style={{ paddingLeft: "1.25rem", margin: 0 }}>
                  {steps.map((step, idx) => (
                    <li key={idx}>
                      <Typography variant="body2" sx={{ mb: 0.7 }}>
                        {step}
                      </Typography>
                    </li>
                  ))}
                </ol>
              </Box>
            )}

            {/* FAQ Detail */}
            {selectedQ && (
              <Card
                sx={{
                  bgcolor: "grey.100",
                  boxShadow: 3,
                  borderRadius: 3,
                  p: 2,
                  textAlign: "center",
                  mt: 1,
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {selectedQ.q}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ mt: 1, whiteSpace: "pre-line" }}
                  >
                    {selectedQ.a}
                  </Typography>
                  <Button
                    size="small"
                    sx={{ mt: 3 }}
                    onClick={() => setSelectedQ(null)}
                    aria-label={t(`${pageKey}.backToHelp`, "Back to Help")}
                  >
                    {t(`${pageKey}.backToHelp`, "Back to Help")}
                  </Button>
                </CardContent>
              </Card>
            )}
          </Box>

          {/* Footer */}
          <Divider />
          <Box sx={{ p: 2 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={() =>
                alert(t(`${pageKey}.contactFormAlert`, "Contact form will be here"))
              }
              aria-label={t(`${pageKey}.contactUs`, "Contact Us")}
            >
              {t(`${pageKey}.contactUs`, "Contact Us")}
            </Button>
          </Box>
        </Box>
      </Zoom>
    </>
  );
}
