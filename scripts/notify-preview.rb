#!/usr/bin/env ruby

platform = ENV.fetch("PREVIEW_PLATFORM")
status = ENV.fetch("PREVIEW_RESULT")
commit = ENV.fetch("PREVIEW_SHA")[0, 12]

unless %w[succeeded failed].include?(status)
  warn "PREVIEW_RESULT must be succeeded or failed"
  exit 2
end

unless RUBY_PLATFORM.include?("darwin")
  warn "Skipping macOS preview notification outside macOS"
  exit 0
end

title = "Meditation app #{platform} preview"
message = "#{status.capitalize} for #{commit}"
escape = ->(value) { '"' + value.gsub('\\', '\\\\').gsub('"', '\\"') + '"' }
apple_script = "display notification #{escape.call(message)} with title #{escape.call(title)}"

unless system("osascript", "-e", apple_script)
  warn "Unable to send macOS preview notification"
end
