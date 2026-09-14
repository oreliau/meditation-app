#!/usr/bin/env ruby

require "fileutils"
require "json"
require "time"

path = ENV.fetch("PREVIEW_STATE_FILE", "~/.meditation-app/preview-runner-state.json")
path = if path.start_with?("~/")
  File.join(Dir.home, path[2..])
else
  File.expand_path(path)
end
commit = ENV.fetch("PREVIEW_SHA")
platform = ENV.fetch("PREVIEW_PLATFORM")
status = ENV.fetch("PREVIEW_STATUS")
now = Time.now.utc.iso8601

FileUtils.mkdir_p(File.dirname(path))
begin
  lock = File.open("#{path}.lock", File::RDWR | File::CREAT, 0o600)
  lock.flock(File::LOCK_EX)

  state = if File.file?(path)
    JSON.parse(File.read(path))
  rescue JSON::ParserError
    {}
  end
  state["requested_commit"] = commit
  state["requested_at"] = now
  state["platforms"] ||= {}
  state["platforms"][platform] = {
    "commit" => commit,
    "status" => status,
    "updated_at" => now,
  }

  if status == "succeeded"
    state["last_successful_commit"] = commit
    state["last_successful_at"] = now
  end

  temporary_path = "#{path}.tmp.#{$$}"
  File.open(temporary_path, "w", 0o600) { |file| file.write(JSON.pretty_generate(state) + "\n") }
  File.rename(temporary_path, path)
ensure
  lock&.flock(File::LOCK_UN)
  lock&.close
end
