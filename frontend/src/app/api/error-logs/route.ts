import { NextRequest, NextResponse } from 'next/server';

const errorLogs: any[] = [];
const MAX_LOGS = 1000;

export async function POST(request: NextRequest) {
  try {
    const log = await request.json();

    errorLogs.push({
      ...log,
      timestamp: new Date().toISOString(),
    });

    if (errorLogs.length > MAX_LOGS) {
      errorLogs.splice(0, errorLogs.length - MAX_LOGS);
    }

    console.log(`[${log.severity?.toUpperCase() || 'INFO'}] Error in ${log.component}:`, log.error);

    return NextResponse.json(
      { success: true, message: 'Error logged' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to process error log:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to log error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const component = request.nextUrl.searchParams.get('component');
    const severity = request.nextUrl.searchParams.get('severity');

    let filtered = [...errorLogs];

    if (component) {
      filtered = filtered.filter((log) => log.component === component);
    }

    if (severity) {
      filtered = filtered.filter((log) => log.severity === severity);
    }

    const limit = Math.min(
      parseInt(request.nextUrl.searchParams.get('limit') || '100'),
      100
    );

    return NextResponse.json({
      logs: filtered.slice(-limit),
      total: filtered.length,
    });
  } catch (error) {
    console.error('Failed to retrieve error logs:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve logs' },
      { status: 500 }
    );
  }
}
