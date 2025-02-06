import { Box, Container, Text } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import "../App.css";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinkStyle = (path: string) => ({
    color: "inherit",
    textDecoration: "none",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    transition: "all 0.2s",
    backgroundColor: isActive(path)
      ? "rgba(255, 255, 255, 0.1)"
      : "transparent",
  });

  return (
    <Box
      bg="#2d3748"
      color="white"
      py={4}
      borderBottom="1px solid"
      borderColor="whiteAlpha.200"
    >
      <Container maxW="container.xl">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Text fontSize="xl" fontWeight="bold" color="blue.200">
            JapanCard
          </Text>
          <Box display="flex" gap={6}>
            <Link
              to="/"
              style={navLinkStyle("/")}
              className="nav-link"
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255, 255, 255, 0.1)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = isActive("/")
                  ? "rgba(255, 255, 255, 0.1)"
                  : "transparent")
              }
            >
              Translate
            </Link>
            <Link
              to="/words"
              style={navLinkStyle("/words")}
              className="nav-link"
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255, 255, 255, 0.1)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = isActive("/words")
                  ? "rgba(255, 255, 255, 0.1)"
                  : "transparent")
              }
            >
              Word List
            </Link>
            <Link
              to="/quiz"
              style={navLinkStyle("/quiz")}
              className="nav-link"
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255, 255, 255, 0.1)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = isActive("/quiz")
                  ? "rgba(255, 255, 255, 0.1)"
                  : "transparent")
              }
            >
              Quiz
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Navbar;
