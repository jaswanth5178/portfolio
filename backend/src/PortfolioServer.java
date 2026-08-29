import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class PortfolioServer {

    private static final int PORT = 8090;

    // Change these three values to your MySQL details.
    private static final String DB_URL =
            "jdbc:mysql://localhost:3306/portfolio_db?useSSL=false&serverTimezone=Asia/Kolkata";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "YOUR_MYSQL_PASSWORD";

    public static void main(String[] args) throws Exception {
        Class.forName("com.mysql.cj.jdbc.Driver");

        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);
        server.createContext("/api/health", PortfolioServer::health);
        server.createContext("/api/contact", PortfolioServer::contact);
        server.setExecutor(null);
        server.start();

        System.out.println("======================================");
        System.out.println("Jaswanth Portfolio Backend is running");
        System.out.println("http://localhost:" + PORT);
        System.out.println("======================================");
    }

    private static void health(HttpExchange exchange) throws IOException {
        addCors(exchange);

        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            send(exchange, 204, "");
            return;
        }

        if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
            sendJson(exchange, 405, "{\"success\":false,\"message\":\"Method not allowed\"}");
            return;
        }

        sendJson(exchange, 200, "{\"success\":true,\"message\":\"Portfolio backend is running\"}");
    }

    private static void contact(HttpExchange exchange) throws IOException {
        addCors(exchange);

        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            send(exchange, 204, "");
            return;
        }

        if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            sendJson(exchange, 405, "{\"success\":false,\"message\":\"Only POST is allowed\"}");
            return;
        }

        try {
            String body = readBody(exchange.getRequestBody());
            Map<String, String> data = parseSimpleJson(body);

            String name = clean(data.get("name"));
            String email = clean(data.get("email"));
            String message = clean(data.get("message"));

            if (name.isBlank() || email.isBlank() || message.isBlank()) {
                sendJson(exchange, 400,
                        "{\"success\":false,\"message\":\"Name, email and message are required\"}");
                return;
            }

            if (!email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
                sendJson(exchange, 400,
                        "{\"success\":false,\"message\":\"Please enter a valid email address\"}");
                return;
            }

            String sql = "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)";

            try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
                 PreparedStatement statement = connection.prepareStatement(sql)) {

                statement.setString(1, name);
                statement.setString(2, email);
                statement.setString(3, message);
                statement.executeUpdate();
            }

            sendJson(exchange, 201,
                    "{\"success\":true,\"message\":\"Your message has been sent successfully\"}");

        } catch (SQLException e) {
            e.printStackTrace();
            sendJson(exchange, 500,
                    "{\"success\":false,\"message\":\"Database error. Check MySQL and backend settings.\"}");
        } catch (Exception e) {
            e.printStackTrace();
            sendJson(exchange, 400,
                    "{\"success\":false,\"message\":\"Invalid request\"}");
        }
    }

    private static String readBody(InputStream input) throws IOException {
        return new String(input.readAllBytes(), StandardCharsets.UTF_8);
    }

    // This small parser is enough for the three text fields sent by this portfolio.
    private static Map<String, String> parseSimpleJson(String json) {
        Map<String, String> result = new HashMap<>();
        Pattern pattern = Pattern.compile(
                "\"(name|email|message)\"\\s*:\\s*\"((?:\\\\.|[^\"\\\\])*)\"",
                Pattern.DOTALL);
        Matcher matcher = pattern.matcher(json);

        while (matcher.find()) {
            result.put(matcher.group(1), unescape(matcher.group(2)));
        }
        return result;
    }

    private static String unescape(String value) {
        return value.replace("\\\"", "\"")
                .replace("\\\\", "\\")
                .replace("\\n", "\n")
                .replace("\\r", "\r")
                .replace("\\t", "\t");
    }

    private static String clean(String value) {
        return value == null ? "" : value.trim();
    }

    private static void addCors(HttpExchange exchange) {
        Headers headers = exchange.getResponseHeaders();
        headers.set("Access-Control-Allow-Origin", "*");
        headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        headers.set("Access-Control-Allow-Headers", "Content-Type");
        headers.set("Content-Type", "application/json; charset=UTF-8");
    }

    private static void sendJson(HttpExchange exchange, int status, String json) throws IOException {
        send(exchange, status, json);
    }

    private static void send(HttpExchange exchange, int status, String response) throws IOException {
        byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(status, bytes.length);
        try (OutputStream output = exchange.getResponseBody()) {
            output.write(bytes);
        }
    }
}
